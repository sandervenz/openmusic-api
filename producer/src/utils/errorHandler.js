const ClientError = require('../exceptions/ClientError');
const AuthenticationError = require('../exceptions/AuthenticationError')
const AuthorizationError = require('../exceptions/AuthorizationError')

const handleError = (error, h) => {
  if (error instanceof ClientError) {
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(error.statusCode);
  }

  if (error instanceof AuthenticationError) {
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(error.statusCode);
  }

  if (error instanceof AuthorizationError) {
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(error.statusCode);
  }

  console.error(error);
  return h.response({
    status: 'error',
    message: 'Terjadi kegagalan pada server kami.',
  }).code(500);
};

module.exports = handleError;
