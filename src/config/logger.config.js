const { createLogger, transports, format } = require("winston");
const fs = require("fs");
const path = require("path");

// const logsDir = "logs";
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// const logFilePath = path.join(logsDir, "app.log");

const logger = createLogger({
  transports: [
    // Log to console
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    // Log to file
    // new transports.File({
    //   filename: logFilePath,
    //   format: format.combine(
    //     format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    //     format.printf(
    //       (info) => `${info.timestamp} ${info.level}: ${info.message}`
    //     )
    //   ),
    // }),
  ],
});

module.exports = logger;
