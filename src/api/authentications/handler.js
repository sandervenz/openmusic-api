const handleError = require('../../utils/errorHandler');
const AuthenticationsValidator = require('../../validator/authentications');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      AuthenticationsValidator.validatePostAuthenticationPayload(request.payload);
      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      return h.response({
        status: 'success',
        message: 'Authentication berhasil',
        data: { accessToken, refreshToken },
      }).code(201);
    } catch (error) {
      return handleError(error, h);
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      AuthenticationsValidator.validatePutAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ id });

      return {
        status: 'success',
        message: 'Access token diperbarui',
        data: { accessToken },
      };
    } catch (error) {
      return handleError(error, h);
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      AuthenticationsValidator.validateDeleteAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;

      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = AuthenticationsHandler;
