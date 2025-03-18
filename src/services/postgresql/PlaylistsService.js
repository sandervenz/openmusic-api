const { nanoid } = require('nanoid');
const pool = require('./DatabaseConfig');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
        text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
        values: [id, name, owner],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
             FROM playlists 
             JOIN users ON users.id = playlists.owner 
             WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async deletePlaylist(playlistId, owner) {
    await this.verifyPlaylistOwner(playlistId, owner);
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;
