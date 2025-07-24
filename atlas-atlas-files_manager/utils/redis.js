import { createClient } from 'redis';
/**
 * RedisClient provides a wrapper around the Redis client for connecting,
 * getting, setting, and deleting keys in a Redis store.
 * 
 * Usage:
 *   const redisClient = new RedisClient();
 *   await redisClient.connect();
 *   await redisClient.set('key', 'value', 3600);
 *   const value = await redisClient.get('key');
 *   await redisClient.del('key');
 */
class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = false;

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      this.isConnected = false;
    });
  }

  async connect() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
  }

  isClientConnected() {
    return this.isConnected;
  }

  async get(key) {
    try {
      const reply = await this.client.get(key);
      return reply;
    } catch (err) {
      throw err;
    }
  }

  async set(key, value, duration) {
    try {
      // Use set with EX option for expiration
      const reply = await this.client.set(key, value, { EX: duration });
      return reply;
    } catch (err) {
      throw err;
    }
  }

  async del(key) {
    try {
      const reply = await this.client.del(key);
      return reply;
    } catch (err) {
      throw err;
    }
  }
}

export default RedisClient;
