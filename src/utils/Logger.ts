import winston from "winston";

const { combine, timestamp, prettyPrint, splat } = winston.format;

const Logger = winston.createLogger({
  level: "debug",
  format: combine(timestamp(), splat(), prettyPrint()),
  transports: [
    // new winston.transports.File({ filename: "error.log", level: "error" }),
    // new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console(),
  ],
});

export default Logger;
