require('dotenv').config();
const Hapi = require('@hapi/hapi');
const AlbumsService = require('./services/postgresql/AlbumsService');
const SongsService = require('./services/postgresql/SongsService');
const albums = require('./api/albums');
const songs = require('./api/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: { cors: { origin: ['*'] } },
  });

  await server.register([
    { plugin: albums, options: { service: albumsService } },
    { plugin: songs, options: { service: songsService } },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
