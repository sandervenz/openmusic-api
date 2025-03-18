const handleError = require('../../utils/errorHandler');
const PlaylistsValidator = require('../../validator/playlists');

class PlaylistsHandler {
  constructor(service) {
    this._service = service;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      PlaylistsValidator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: owner } = request.auth.credentials; // Ambil owner dari token yang digunakan
  
      const playlistId = await this._service.addPlaylist(name, owner);
  
      const response = h.response({
        status: 'success',
        data: { playlistId },
      });
      response.code(201);
      return response;
    } catch (error) {
      return handleError(error, h);
    }
  }
  

  async getPlaylistsHandler(request, h) {
    try {
      const { id: owner } = request.auth.credentials;
      const playlists = await this._service.getPlaylists(owner);

      return {
        status: 'success',
        data: { playlists },
      };
    } catch (error) {
      return handleError(error, h);
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { id: owner } = request.auth.credentials;
      const { playlistId } = request.params;
      
      await this._service.deletePlaylist(playlistId, owner);
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = PlaylistsHandler;
