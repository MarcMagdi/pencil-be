import dotenv from "dotenv";
import mongoose from "mongoose";
import Logger from "../utils/Logger";

dotenv.config();

/**
 * Database manager class
 * check if the connection manager has alive connection
 * if doesn't have create new connection
 */
export class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public async getConnection() {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_CLUSTER,
      MONGO_DB_NAME,
    } = process.env;

    Logger.info(
      "Username: (%s) Cluster: (%s) DBName: (%s)",
      MONGO_USERNAME,
      MONGO_CLUSTER,
      MONGO_DB_NAME
    );

    const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;

    const connectionOptions = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };

    return mongoose.connect(uri, connectionOptions);
  }
}
