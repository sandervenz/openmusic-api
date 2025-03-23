const path = require('path');
const AlbumsValidator = require('../../validator/albums');
const handleError = require('../../utils/errorHandler');

class AlbumsHandler {
  constructor(albumsService, storageService) {
    this._albumsService = albumsService;
    this._storageService = storageService;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.uploadCoverHandler = this.uploadCoverHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      AlbumsValidator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this._albumsService.addAlbum(name, year);

      return h.response({
        status: 'success',
        data: { albumId },
      }).code(201);
    } catch (error) {
      return handleError(error, h);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._albumsService.getAlbumById(id);

      return h.response({
        status: 'success',
        data: {
          album: {
            id: album.id,
            name: album.name,
            year: album.year,
            coverUrl: album.cover,
            songs: album.songs.map((song) => ({
              id: song.id,
              title: song.title,
              performer: song.performer,
            })),
          },
        },
      }).code(200);
    } catch (error) {
      return handleError(error, h);
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      AlbumsValidator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      const { name, year } = request.payload;

      await this._albumsService.editAlbumById(id, { name, year });

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      return handleError(error, h);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._albumsService.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      return handleError(error, h);
    }
  }

  async uploadCoverHandler(request, h) {
    console.log('🚀 UploadCoverHandler terpanggil!');

    const { id } = request.params;
    const { cover } = request.payload;

    if (!cover) {
      return h.response({
        status: 'fail',
        message: 'File cover harus dikirim',
      }).code(400);
    }

    // **✅ Validasi MIME type hanya gambar**
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(cover.hapi.headers['content-type'])) {
      return h.response({
        status: 'fail',
        message: 'Format file tidak didukung, gunakan JPG atau PNG',
      }).code(400);
    }

    // **✅ Validasi ukuran file maksimal 500KB**
    if (cover._data.length > 512000) {
      return h.response({
        status: 'fail',
        message: 'Ukuran file tidak boleh lebih dari 500KB',
      }).code(400);
    }

    // **Dapatkan cover lama untuk dihapus**
    const oldAlbum = await this._albumsService.getAlbumById(id);
    const oldCoverUrl = oldAlbum.cover_url;

    // **Upload cover baru**
    const filename = `cover-${id}${path.extname(cover.hapi.filename)}`;
    const fileBuffer = cover._data;

    try {
      const fileUrl = await this._storageService.uploadFile(fileBuffer, filename, cover.hapi.headers['content-type']);

      // **Hapus cover lama jika ada**
      if (oldCoverUrl) {
        const oldFileName = oldCoverUrl.split('/').pop();
        await this._storageService.deleteFile(oldFileName);
      }

      // **Simpan URL cover album ke database**
      await this._albumsService.updateAlbumCover(id, fileUrl);

      return h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      }).code(201);
    } catch (error) {
      return handleError(error, h);
    }
  }
}

module.exports = AlbumsHandler;
