const PlaylistSongsValidator = require('../../validator/playlistsongs');
const handleError = require('../../utils/errorHandler');

class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, songsService) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      PlaylistSongsValidator.validatePlaylistSongPayload(request.payload);
      const { songId } = request.payload;
      const { playlistId } = request.params;
      const { id: userId } = request.auth.credentials;

      // Pastikan lagu ada di database
      await this._songsService.getSongById(songId);

      await this._playlistSongsService.addSongToPlaylist(playlistId, songId, userId);

      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke dalam playlist',
      }).code(201);
    } catch (error) {
      return handleError(error, h);
    }
  }

  async getSongsFromPlaylistHandler(request, h) {
    try {
      const { id: userId } = request.auth.credentials;
      const { playlistId } = request.params;

      const playlist = await this._playlistSongsService.getSongsFromPlaylist(playlistId, userId);

      return {
        status: 'success',
        data: { playlist },
      };
    } catch (error) {
      return handleError(error, h);
    }
  }

  async deleteSongFromPlaylistHandler(request, h) {
    try {
      PlaylistSongsValidator.validatePlaylistSongPayload(request.payload);
      const { id: userId } = request.auth.credentials;
      const { playlistId } = request.params;
      const { songId } = request.payload;

      // Verifikasi bahwa user memiliki akses ke playlist
      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

      await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId, userId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = PlaylistSongsHandler;
