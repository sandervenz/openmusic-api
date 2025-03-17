const UsersValidator = require('../../validator/users');
const handleError = require('../../utils/errorHandler');

class UsersHandler {
  constructor(service) {
    this._service = service;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      UsersValidator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;
      const userId = await this._service.addUser({ username, password, fullname });

      return h.response({
        status: 'success',
        data: { userId },
      }).code(201);
    }  
    catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = UsersHandler;
