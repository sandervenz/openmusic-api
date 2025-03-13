class SongsHandler {
    constructor(service) {
      this._service = service;
  
      this.postSongHandler = this.postSongHandler.bind(this);
      this.getSongsHandler = this.getSongsHandler.bind(this);
      this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
      this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }
  
    async postSongHandler(request, h) {
      const songId = await this._service.addSong(request.payload);
      return h.response({ status: 'success', data: { songId } }).code(201);
    }
  
    async getSongsHandler() {
      const songs = await this._service.getSongs();
      return { status: 'success', data: { songs } };
    }
  
    async getSongByIdHandler(request) {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return { status: 'success', data: { song } };
    }
  
    async deleteSongByIdHandler(request) {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return { status: 'success', message: 'Lagu berhasil dihapus' };
    }
  }
  
  module.exports = SongsHandler;
  