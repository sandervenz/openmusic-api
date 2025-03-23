const nodemailer = require('nodemailer');
const config = require('./config');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'OpenMusic API <no-reply@openmusic.com>',
      to: targetEmail,
      subject: 'Ekspor Playlist Anda',
      text: 'Berikut adalah hasil ekspor playlist Anda dalam format JSON.',
      attachments: [
        {
          filename: 'playlist.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
