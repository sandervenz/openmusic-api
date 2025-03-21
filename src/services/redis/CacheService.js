const redis = require('redis');
const { promisify } = require('util');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: config.redis.host,
    });

    this._client.on('error', (err) => {
      console.error('Redis Error:', err);
    });

    // Promisify agar bisa menggunakan async/await
    this.getAsync = promisify(this._client.get).bind(this._client);
    this.setAsync = promisify(this._client.set).bind(this._client);
    this.delAsync = promisify(this._client.del).bind(this._client);
  }

  async set(key, value, expirationInSeconds = 1800) {
    await this.setAsync(key, value, 'EX', expirationInSeconds);
  }

  async get(key) {
    return await this.getAsync(key);
  }

  async delete(key) {
    await this.delAsync(key);
  }
}

module.exports = CacheService;
