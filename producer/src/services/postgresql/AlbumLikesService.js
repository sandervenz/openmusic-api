const { nanoid } = require('nanoid');
const pool = require("./DatabaseConfig");
const CacheService = require("../redis/CacheService");
const InvariantError = require("../../exceptions/InvariantError");

class AlbumLikesService {
  constructor() {
    this._cacheService = new CacheService();
  }

  async likeAlbum(userId, albumId) {
    const id = `like-${nanoid(16)}`;
  
    // Cek apakah user sudah menyukai album
    const checkLikeQuery = {
      text: "SELECT 1 FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };
    const likeResult = await pool.query(checkLikeQuery);
  
    if (likeResult.rowCount) {
      throw new InvariantError("Anda sudah menyukai album ini");
    }
  
    // Simpan like ke database
    const insertLikeQuery = {
      text: "INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3)",
      values: [id, userId, albumId],
    };
    await pool.query(insertLikeQuery);
  
    // Hapus cache agar data diperbarui
    await this._cacheService.delete(`album_likes:${albumId}`);
  }
  

  async unlikeAlbum(userId, albumId) {
    // Hapus like dari database
    const deleteLikeQuery = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };
    const result = await pool.query(deleteLikeQuery);

    if (!result.rowCount) {
      throw new InvariantError("Anda belum menyukai album ini");
    }

    // Hapus cache agar data diperbarui
    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      // Cek apakah data ada di cache
      const cachedLikes = await this._cacheService.get(`album_likes:${albumId}`);
      if (cachedLikes) {
        return { likes: JSON.parse(cachedLikes), source: "cache" };
      }
    } catch (error) {
      console.error("Error getting cache:", error);
    }

    // Jika tidak ada di cache, ambil dari database
    const countLikesQuery = {
      text: "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };
    const result = await pool.query(countLikesQuery);
    const likes = parseInt(result.rows[0].count, 10);

    // Simpan ke cache dengan TTL (1800 detik = 30 menit)
    await this._cacheService.set(`album_likes:${albumId}`, JSON.stringify(likes), 1800);

    return { likes, source: "database" };
  }
}

module.exports = AlbumLikesService;
