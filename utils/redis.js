const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.connected = true;

        this.client.on('error', (err) => {
            console.error('Redis client error:', err);
            this.connected = false;
        });

        this.getAsync = promisify(this.client.get).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }

    // synchronous check (main.js calls isAlive() directly)
    isAlive() {
        return this.connected;
    }

   async get(key) {
    return this.getAsync(key);
    }

    async set(key, value, duration) {
        this.client.set(key, value, 'EX', duration);
    }

    async del(key) {
        return this.delAsync(key);
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;
