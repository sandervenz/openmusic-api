const ExportHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "exports",
  version: "1.0.0",
  register: async (server, { producerService, playlistsService }) => {
    const exportHandler = new ExportHandler(producerService, playlistsService);
    server.route(routes(exportHandler));
  },
};
