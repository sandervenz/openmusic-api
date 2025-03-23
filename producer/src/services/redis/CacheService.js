const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this._connect();
  }

  async _connect() {
    if (!this._client.isOpen) {
      try {
        await this._client.connect();
        console.log('Redis connected successfully');
      } catch (err) {
        console.error('Failed to connect to Redis:', err);
      }
    }
  }

  async set(key, value, expirationInSeconds = 1800) {
    await this._connect();
    try {
      await this._client.setEx(key, expirationInSeconds, value);
    } catch (err) {
      console.error(`Failed to set cache for key: ${key}`, err);
    }
  }

  async get(key) {
    await this._connect();
    try {
      return await this._client.get(key);
    } catch (err) {
      console.error(`Failed to get cache for key: ${key}`, err);
      return null;
    }
  }

  async delete(key) {
    await this._connect();
    try {
      await this._client.del(key);
    } catch (err) {
      console.error(`Failed to delete cache for key: ${key}`, err);
    }
  }

  async close() {
    if (this._client.isOpen) {
      await this._client.quit();
      console.log('Redis connection closed.');
    }
  }
}

module.exports = CacheService;
