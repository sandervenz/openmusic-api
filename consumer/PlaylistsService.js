const { Pool } = require('pg');
const config = require('./config');

class PlaylistsService {
  constructor() {
    this._pool = new Pool(config.database);
  }

  async getSongsFromPlaylist(playlistId) {
    const queryPlaylist = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(queryPlaylist);

    if (!playlistResult.rows.length) {
      throw new Error('Playlist tidak ditemukan');
    }

    const playlist = playlistResult.rows[0];

    const querySongs = {
      text: `
        SELECT songs.id, songs.title, songs.performer
        FROM songs
        JOIN playlist_songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(querySongs);

    return {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        songs: songsResult.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
