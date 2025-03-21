const handleError = require("../../utils/errorHandler");

class AlbumLikesHandler {
    constructor(albumLikesService, albumsService) {
      this._albumLikesService = albumLikesService;
      this._albumsService = albumsService;
  
      this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
      this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
      this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    }
  
    async postAlbumLikeHandler(request, h) {
      try {
        const { id: userId } = request.auth.credentials;
        const { id: albumId } = request.params;
  
        await this._albumsService.verifyAlbumExists(albumId);
        await this._albumLikesService.likeAlbum(userId, albumId);
  
        return h.response({ status: 'success', message: 'Like ditambahkan' }).code(201);
      } catch (error) {
        return handleError(error, h);
      }
    }
  
    async getAlbumLikesHandler(request, h) {
      try {
        const { id: albumId } = request.params;
        await this._albumsService.verifyAlbumExists(albumId);
  
        const { likes, source } = await this._albumLikesService.getAlbumLikes(albumId);
  
        const response = h.response({ status: 'success', data: { likes } });
        if (source === 'cache') {
          response.header('X-Data-Source', 'cache');
        }
        return response;
      } catch (error) {
        return handleError(error, h);
      }
    }
  
    async deleteAlbumLikeHandler(request, h) {
      try {
        const { id: userId } = request.auth.credentials;
        const { id: albumId } = request.params;
  
        await this._albumsService.verifyAlbumExists(albumId);
        await this._albumLikesService.unlikeAlbum(userId, albumId);
  
        return h.response({ status: 'success', message: 'Like dihapus' }).code(200);
      } catch (error) {
        return handleError(error, h);
      }
    }
  }
  
  module.exports = AlbumLikesHandler;  