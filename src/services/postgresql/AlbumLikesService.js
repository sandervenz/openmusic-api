const CacheService = require('../redis/CacheService');

class AlbumLikesService {
  constructor() {
    this._cacheService = new CacheService();
  }

  async likeAlbum(userId, albumId) {
    // Simpan ke database...
    await this._cacheService.delete(`album_likes:${albumId}`); // Hapus cache saat ada perubahan
  }

  async getAlbumLikes(albumId) {
    try {
      const cachedLikes = await this._cacheService.get(`album_likes:${albumId}`);
      if (cachedLikes) {
        return { likes: JSON.parse(cachedLikes), source: 'cache' };
      }
    } catch (error) {
      console.error('Error getting cache:', error);
    }

    // Jika tidak ada di cache, ambil dari database
    const likes = await this._getLikesFromDatabase(albumId);
    await this._cacheService.set(`album_likes:${albumId}`, JSON.stringify(likes), 1800);
    return { likes, source: 'database' };
  }
}

module.exports = AlbumLikesService;
