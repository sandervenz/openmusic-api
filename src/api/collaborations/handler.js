const CollaborationValidator = require('../../validator/collaborations');
const handleError = require('../../utils/errorHandler');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      CollaborationValidator.validateCollaborationPayload(request.payload);

      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

      return h.response({
        status: 'success',
        data: { collaborationId },
      }).code(201);
    } catch (error) {
      return handleError(error, h);
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      CollaborationValidator.validateCollaborationPayload(request.payload);

      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return h.response({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      }).code(200);
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = CollaborationsHandler;
