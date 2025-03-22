require("dotenv").config();
const amqp = require("amqplib");
const PlaylistsService = require("./services/postgresql/PlaylistsService");
const MailSender = require("./services/mail/MailSender");

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();

  try {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    const queue = "export:playlist";

    await channel.assertQueue(queue, { durable: true });

    console.log(`✅ Consumer berjalan, menunggu pesan di queue "${queue}"...`);

    channel.consume(queue, async (message) => {
      try {
        const { playlistId, targetEmail } = JSON.parse(message.content.toString());

        // Ambil detail playlist dan lagunya
        const playlist = await playlistsService.getPlaylistById(playlistId);

        // Kirim email dengan lampiran JSON
        const result = await mailSender.sendEmail(targetEmail, JSON.stringify(playlist));

        console.log(`📩 Email terkirim ke ${targetEmail}:`, result);

        channel.ack(message); 
      } catch (error) {
        console.error("❌ Error memproses pesan:", error);
      }
    });
  } catch (error) {
    console.error("❌ Gagal menjalankan consumer:", error);
  }
};

init();
