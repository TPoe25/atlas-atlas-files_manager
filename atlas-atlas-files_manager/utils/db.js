import { MongoClient } from 'mongodb';

// Get environment variables or use default values
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const databaseName = process.env.DB_DATABASE || 'files_manager';

// MongoDB URI
const uri = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.db = null;

    // Connect to MongoDB immediately on instantiation
    this.client.connect()
      .then(() => {
        this.db = this.client.db(databaseName);
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
      });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    if (!this.db) return 0;
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    if (!this.db) return 0;
    return this.db.collection('files').countDocuments();
  }
}

// Export a single instance
const dbClient = new DBClient();
export default dbClient;