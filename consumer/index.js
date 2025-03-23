const connectRabbitMQ = require('./rabbitmq');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

(async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const { connection, channel } = await connectRabbitMQ();
  console.log('🐰 RabbitMQ Consumer berjalan...');

  channel.consume('export:playlists', listener.listen, { noAck: true });
})();
