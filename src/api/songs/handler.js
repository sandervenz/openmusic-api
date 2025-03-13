const SongsValidator = require('../validator/songs');
const handleError = require('../utils/handleError');

class SongsHandler {
  constructor(service) {
    this._service = service;

    this.addSongHandler = this.addSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.editSongByIdHandler = this.editSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async addSongHandler(request, h) {
    try {
      SongsValidator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } = request.payload;
      const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

      const response = h.response({
        status: 'success',
        data: { songId },
      });
      response.code(201);
      return response;
    } catch (error) {
      return handleError(error, h);
    }
  }

  async getSongsHandler(request, h) {
    try {
      const { title, performer } = request.query;
      const songs = await this._service.getSongs({ title, performer });

      return {
        status: 'success',
        data: { songs },
      };
    } catch (error) {
      return handleError(error, h);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: { song },
      };
    } catch (error) {
      return handleError(error, h);
    }
  }

  async editSongByIdHandler(request, h) {
    try {
      SongsValidator.validateSongPayload(request.payload);
      const { id } = request.params;
      const { title, year, genre, performer, duration, albumId } = request.payload;

      await this._service.editSongById(id, { title, year, genre, performer, duration, albumId });

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      };
    } catch (error) {
      return handleError(error, h);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = SongsHandler;
