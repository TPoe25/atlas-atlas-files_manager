import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || '127.0.0.1';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${this.host}:${this.port}/${this.database}`;

    // Initialize MongoDB client with Unified Topology support
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.db = null;
    this.connected = false;

    this.client.connect()
      .then(() => {
        this.db = this.client.db(this.database);
        this.connected = true;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    if (!this.db) return 0;
    try {
      return await this.db.collection('users').countDocuments();
    } catch {
      return 0;
    }
  }

  async nbFiles() {
    if (!this.db) return 0;
    try {
      return await this.db.collection('files').countDocuments();
    } catch {
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
