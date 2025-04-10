const InvariantError = require("../../exceptions/InvariantError");
const { ExportPlaylistPayloadSchema } = require("./schema");

const ExportsValidator = {
  validateExportPayload: (payload) => {
    const validationResult = ExportPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
