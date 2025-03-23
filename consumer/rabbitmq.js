const amqp = require('amqplib');
const config = require('./config');

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();
  await channel.assertQueue('export:playlists', { durable: true });
  return { connection, channel };
};

module.exports = connectRabbitMQ;
