const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

class StorageService {
  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.AWS_BUCKET_NAME;
  }

  async uploadFile(fileBuffer, fileName, mimeType) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: 'public-read',
      };
      
    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);

      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Gagal mengunggah file ke S3');
    }
  }

  async deleteFile(fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Gagal menghapus file dari S3');
    }
  }
}

module.exports = StorageService;
