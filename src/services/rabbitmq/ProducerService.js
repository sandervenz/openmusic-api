const amqp = require("amqplib");

class ProducerService {
  constructor() {
    this.rabbitmqServer = process.env.RABBITMQ_SERVER;
  }

  async sendMessage(queue, message) {
    const connection = await amqp.connect(this.rabbitmqServer);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));

    console.log(`[x] Sent message to queue "${queue}": ${message}`); // debugging

    setTimeout(() => {
      connection.close();
    }, 1000);
  }
}

module.exports = ProducerService;
