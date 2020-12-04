import express from "express";
import morgan from "morgan";
import routes from "./routes/api";
import { Database } from "./db";
import Logger from "./utils/Logger";

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("combined"));
app.use("/api", routes);
app.listen(port, () => {
  return Logger.info(`server is listening on ${port}`);
});

Database.getInstance()
  .getConnection()
  .then(() => {
    Logger.info("Database connection initialized");
  });
