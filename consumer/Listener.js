class Listener {
    constructor(playlistsService, mailSender) {
      this._playlistsService = playlistsService;
      this._mailSender = mailSender;
  
      this.listen = this.listen.bind(this);
    }
  
    async listen(message) {
      try {
        const { playlistId, targetEmail } = JSON.parse(message.content.toString());
  
        console.log(`📥 Menerima pesan ekspor playlist: ${playlistId} untuk ${targetEmail}`);
  
        // Ambil data lagu dalam playlist
        const playlist = await this._playlistsService.getSongsFromPlaylist(playlistId);
  
        // Konversi ke JSON string
        const jsonData = JSON.stringify(playlist);
  
        // Kirim email dengan JSON file
        await this._mailSender.sendEmail(targetEmail, jsonData);
  
        console.log(`📤 Email terkirim ke ${targetEmail}`);
      } catch (error) {
        console.error(`❌ Gagal memproses pesan: ${error.message}`);
      }
    }
  }
  
  module.exports = Listener;
  