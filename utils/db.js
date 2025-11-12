import redisClient from "./utils/redis";

class DBClient {
  constructor() {
    this.redisClient = redisClient;
    this.mongo = {
      type: "MongoDB",
      host: "localhost",
      port: 27017,
      database: "files_manager",
    };
  }

  isAlive() {
    if (this.redisClient && this.redisClient.isReady === true) {
      return true;
    } else {
      console.log("Redis is not ready");
      return false;
    }
  }
}

export default DBClient;
