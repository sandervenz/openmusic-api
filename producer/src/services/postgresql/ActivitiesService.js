const { nanoid } = require("nanoid");
const pool = require("./DatabaseConfig");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class ActivitiesService {
  constructor(playlistService) {
    this._playlistService = playlistService;

    this.addActivity = this.addActivity.bind(this);
    this.getActivitiesByPlaylistId = this.getActivitiesByPlaylistId.bind(this);
  }

  async addActivity(playlistId, songId, userId, action) {
    await this._playlistService.verifyPlaylistAccess(playlistId, userId);
    
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: `INSERT INTO playlist_activities 
             (id, playlist_id, song_id, user_id, action, time) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [id, playlistId, songId, userId, action, time],
    };

    try {
      await pool.query(query);
    } catch {
      throw new InvariantError("Gagal mencatat aktivitas.");
    }
  }

  async getActivitiesByPlaylistId(playlistId, userId) {
    const query = {
      text: `SELECT users.username, songs.title, action, time 
             FROM playlist_activities
             JOIN users ON users.id = playlist_activities.user_id
             JOIN songs ON songs.id = playlist_activities.song_id
             WHERE playlist_activities.playlist_id = $1
             ORDER BY time ASC`,
      values: [playlistId],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
        throw new NotFoundError("Playlist tidak ditemukan");
    }

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    return result.rows;
  }
}

module.exports = ActivitiesService;
