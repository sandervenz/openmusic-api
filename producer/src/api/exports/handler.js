const ExportsValidator = require("../../validator/exports");
const handleError = require("../../utils/errorHandler");

class ExportsHandler {
  constructor(producerService, playlistsService) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    try {
      ExportsValidator.validateExportPayload(request.payload);

      const { playlistId } = request.params;
      const { targetEmail } = request.payload;
      const { id: userId } = request.auth.credentials;

      // Pastikan user adalah pemilik playlist
      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

      // Kirim pesan ke RabbitMQ
      const message = { playlistId, targetEmail };
      await this._producerService.sendMessage("export:playlist", JSON.stringify(message));

      return h.response({
        status: "success",
        message: "Permintaan Anda sedang kami proses",
      }).code(201);
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = ExportsHandler;
