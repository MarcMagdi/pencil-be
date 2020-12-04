import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
} from "typeorm";
import dotenv from "dotenv";

import Logger from "../utils/Logger";

dotenv.config();

/**
 * Database manager class
 * check if the connection manager has alive connection
 * if doesn't have create new connection
 */
export class Database {
  private static instance: Database;

  private connectionManager: ConnectionManager;

  private constructor() {
    this.connectionManager = getConnectionManager();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = "default";
    let connection: Connection;
    if (this.connectionManager.has(CONNECTION_NAME)) {
      Logger.info("Establishing connection...");
      connection = this.connectionManager.get(CONNECTION_NAME);
      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
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

      const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;

      const connectionOptions: ConnectionOptions = {
        type: "mongodb",
        synchronize: true,
        logging: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        url: url,
        entities: ["src/models/*.*"],
      };

      connection = await createConnection(connectionOptions);
    }
    return connection;
  }
}
