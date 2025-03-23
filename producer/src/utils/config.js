const config = {
    s3: {
      bucketName: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    rabbitMq: {
      server: process.env.RABBITMQ_SERVER,
    },
    redis: {
      host: process.env.REDIS_SERVER,
    },
  };
  
  module.exports = config;
  