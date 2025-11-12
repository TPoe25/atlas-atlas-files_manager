import { createClient } from 'redis';


class RedisClient {
    constructor() {
        this.client = createClient();
        this._connectPromise = null;

        this.client.on('ready', () => {
            console.log('true');
        });
        this.client.off('error', (err) => {
            console.error('Redis Client Error:', err);
        });
    }

    // synchronous check (main.js calls isAlive() directly)
    isAlive() {
        return !!this.client && this.client.isReady === true;
    }

    // internal helper to ensure connection (reuses in-progress connect)
    async _ensureConnected() {
        try {
            if (this.client.isReady === true)
                return true;

            if (!this._connectPromise) {
                this._connectPromise = this.client.connect()
                    .catch((err) => {
                        console.error('Redis connect error:', err);
                        throw err;
                    })
                    .finally(() => {
                        this._connectPromise = null;
                    });
            }

            await this._connectPromise;
            return this.client.isReady === true;
        } catch (err) {
            console.error('ensureConnected error:', err);
            return false;
        }
    }

    async get(key) {
        const ok = await this._ensureConnected();
        //if (!ok) throw new Error('Redis client not connected');
        return this.client.get(key);
    }

    async set(key, value, ttlSeconds) {
        const ok = await this._ensureConnected();
        if (!ok) throw new Error('Redis client not connected');
        const val = String(value);
        if (typeof ttlSeconds === 'number') {
            return this.client.set(key, val, { EX: ttlSeconds });
        }
        return this.client.set(key, val);
    }

    async del(key) {
        const ok = this._ensureConnected();
        if (!ok) throw new Error('Redis client not connected');
        return this.client.del(key);
    }
}

const redisClient = new RedisClient();
export default redisClient;
