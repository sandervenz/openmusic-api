const Joi = require('joi');

const AuthenticationSchema = {
  postAuthentication: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  
  putAuthentication: Joi.object({
    refreshToken: Joi.string().required(),
  }),
  
  deleteAuthentication: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = AuthenticationSchema;
