const CollaborationPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const CollaborationValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.details[0].message);
    }
  },
};

module.exports = CollaborationValidator;
