const { nanoid } = require('nanoid');
const pool = require('./DatabaseConfig');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CollaborationsService {
  async addCollaboration(playlistId, userId) {
    // Pastikan user ada di database
    const userCheckQuery = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };
    const userResult = await pool.query(userCheckQuery);
  
    if (!userResult.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
  
    // Lanjutkan menambahkan kolaborasi
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };
  
    const result = await pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan kolaborasi');
    }
  
    return result.rows[0].id;
  }
  

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Kolaborasi gagal dihapus');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = CollaborationsService;
