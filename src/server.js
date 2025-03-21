require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Services
const AlbumsService = require('./services/postgresql/AlbumsService');
const SongsService = require('./services/postgresql/SongsService');
const UsersService = require('./services/postgresql/UsersService');
const AuthenticationsService = require('./services/postgresql/AuthenticationsService');
const PlaylistsService = require('./services/postgresql/PlaylistsService');
const PlaylistSongsService = require('./services/postgresql/PlaylistSongsService');
const ActivitiesService = require('./services/postgresql/ActivitiesService');
const CollaborationsService = require('./services/postgresql/CollaborationsService');
const AlbumLikesService = require('./services/postgresql/AlbumLikesService');
// const ExportService = require('./services/rabbitmq/ProducerService');
// const StorageService = require('./services/s3/StorageService');
const CacheService = require('./services/redis/CacheService');

const TokenManager = require('./tokenize/TokenManager');

// API Modules
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const playlistSongs = require('./api/playlistsongs');
const activities = require('./api/activities');
const collaborations = require('./api/collaborations');
const albumLikes = require('./api/albumlikes');
// const exportsHandler = require('./api/exports');

// Exceptions
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const activitiesService = new ActivitiesService(playlistsService);
  const playlistSongsService = new PlaylistSongsService(playlistsService, activitiesService);
  const albumLikesService = new AlbumLikesService(cacheService);
  // const exportService = new ExportService();
  // const storageService = new StorageService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: { cors: { origin: ['*'] } },
  });

  // Register Plugin JWT Authentication
  await server.register(Jwt);

  // JWT Authentication Strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  // Register API Modules
  await server.register([
    { plugin: albums, options: { service: albumsService,  } }, // ✅ Upload gambar album  storageService
    { plugin: songs, options: { service: songsService } },
    { plugin: users, options: { service: usersService } },
    {
      plugin: authentications,
      options: { authenticationsService, usersService, tokenManager: TokenManager },
    },
    { plugin: playlists, options: { service: playlistsService } },
    {
      plugin: playlistSongs,
      options: { playlistSongsService, playlistsService, songsService },
    },
    {
      plugin: activities,
      options: { activitiesService, playlistsService },
    },
    {
      plugin: collaborations,
      options: { collaborationsService, playlistsService },
    },
    {
      plugin: albumLikes,
      options: { albumLikesService, albumsService },
    },
    // {
    //   plugin: exportsHandler,
    //   options: { service: exportService, playlistsService },
    // },
  ]);

  // Error Handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`🚀 Server berjalan pada ${server.info.uri}`);
};

init();