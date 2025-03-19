const { nanoid } = require('nanoid');
const pool = require('./DatabaseConfig');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor(collaborationsService) {
    this._collaborationsService = collaborationsService;

    this.addPlaylist = this.addPlaylist.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.getPlaylistById = this.getPlaylistById.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.verifyPlaylistOwner = this.verifyPlaylistOwner.bind(this);
    this.verifyPlaylistAccess = this.verifyPlaylistAccess.bind(this);
  }

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

  async getPlaylists(userId) {
    const query = {
      text: `
        SELECT playlists.id, playlists.name, users.username 
        FROM playlists
        JOIN users ON users.id = playlists.owner
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1
        GROUP BY playlists.id, playlists.name, users.username
      `,
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async getPlaylistById(playlistId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const playlistQuery = {
      text: `
        SELECT playlists.id, playlists.name, users.username 
        FROM playlists
        JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1
      `,
      values: [playlistId],
    };

    const playlistResult = await pool.query(playlistQuery);
    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return playlistResult.rows[0];
  }

  async deletePlaylist(playlistId, userId) {
    await this.verifyPlaylistOwner(playlistId, userId);

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda bukan pemilik playlist ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch {
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw new AuthorizationError('Anda tidak memiliki akses ke playlist ini');
      }
    }
  }  
}

module.exports = PlaylistService;
