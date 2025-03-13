const SongsValidator = require('../../validator/songs'); // Sesuaikan path

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator; // Simpan validator sebagai property instance

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      // Validasi payload sebelum diproses
      this._validator.validateSongPayload(request.payload);

      const { title, year, genre, performer, duration, albumId } = request.payload;
      const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

      return h.response({
        status: 'success',
        data: { songId },
      }).code(201);
    } catch (error) {
      return handleError(error, h);
    }
  }

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: { song },
    };
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      await this._service.editSongById(id, request.payload);

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      };
    } catch (error) {
      return handleError(error, h);
    }
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
