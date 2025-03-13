class AlbumsHandler {
    constructor(service) {
      this._service = service;
  
      this.postAlbumHandler = this.postAlbumHandler.bind(this);
      this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
      this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }
  
    async postAlbumHandler(request, h) {
      const { name, year } = request.payload;
      const albumId = await this._service.addAlbum({ name, year });
  
      return h.response({
        status: 'success',
        data: { albumId },
      }).code(201);
    }
  
    async getAlbumByIdHandler(request, h) {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
  
      return {
        status: 'success',
        data: { album },
      };
    }
  
    async deleteAlbumByIdHandler(request, h) {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
  
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    }
  }
  
  module.exports = AlbumsHandler;
  