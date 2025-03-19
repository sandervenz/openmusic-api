const { nanoid } = require('nanoid');
const pool = require('./DatabaseConfig');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(playlistService, activitiesService) {
    this._playlistService = playlistService;
    this._activitiesService = activitiesService;

    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
    this.getSongsFromPlaylist = this.getSongsFromPlaylist.bind(this);
    this.deleteSongFromPlaylist = this.deleteSongFromPlaylist.bind(this);
  }

  async addSongToPlaylist(playlistId, songId, userId) {
    await this._playlistService.verifyPlaylistAccess(playlistId, userId);
    
    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist');
    }

    await this._activitiesService.addActivity(playlistId, songId, userId, "add");
  }

  async getSongsFromPlaylist(playlistId, userId) {
    // 1️⃣ Cek apakah playlist ada terlebih dahulu
    const checkQuery = {
        text: `SELECT playlists.id, playlists.name, users.username
               FROM playlists
               JOIN users ON users.id = playlists.owner
               WHERE playlists.id = $1`,
        values: [playlistId],
    };

    const checkResult = await pool.query(checkQuery);
    if (!checkResult.rows.length) {
        throw new NotFoundError("Playlist tidak ditemukan");
    }

    // 2️⃣ Jika playlist ada, baru cek akses
    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    // 3️⃣ Ambil daftar lagu dari playlist
    const query = {
        text: `
            SELECT songs.id as song_id, songs.title, songs.performer
            FROM playlist_songs
            JOIN songs ON songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1
        `,
        values: [playlistId],
    };

    const result = await pool.query(query);

    return {
      id: checkResult.rows[0].id,
      name: checkResult.rows[0].name,
      username: checkResult.rows[0].username,
      songs: result.rows.map(row => ({
          id: row.song_id,
          title: row.title,
          performer: row.performer
      }))
    };
  }


  async deleteSongFromPlaylist(playlistId, songId, userId) {
    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan dalam playlist');
    }

    await this._activitiesService.addActivity(playlistId, songId, userId, "delete");
  }
}

module.exports = PlaylistSongsService;
