const handleError = require("../../utils/errorHandler");

class ActivitiesHandler {
  constructor(activitiesService, playlistsService) {
    this._activitiesService = activitiesService;
    this._playlistsService = playlistsService;

    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async getActivitiesHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: userId } = request.auth.credentials;

      // Ambil aktivitas playlist
      const activities = await this._activitiesService.getActivitiesByPlaylistId(playlistId, userId);

      return h.response({
        status: "success",
        data: {
          playlistId,
          activities,
        },
      }).code(200);
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = ActivitiesHandler;
