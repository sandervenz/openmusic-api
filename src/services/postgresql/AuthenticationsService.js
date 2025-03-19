const pool = require('./DatabaseConfig');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = pool;
  }

  async addRefreshToken(token) {
    const queryCheck = {
        text: 'SELECT token FROM authentications WHERE token = $1',
        values: [token],
    };
    const checkResult = await this._pool.query(queryCheck);

    if (checkResult.rowCount > 0) {
        throw new InvariantError('Token sudah ada, duplikasi tidak diperbolehkan');
    }

    const queryInsert = {
        text: 'INSERT INTO authentications (token) VALUES ($1)',
        values: [token],
    };
    await this._pool.query(queryInsert);
}


  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };
    const result = await this._pool.query(query);
    
    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}

module.exports = AuthenticationsService;
