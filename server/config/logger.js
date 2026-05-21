const { createLogger, format, transports } = require("winston");

const isProduction = process.env.NODE_ENV === "production";

const logger = createLogger({
    level: isProduction ? "info" : "debug",

    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),

    defaultMeta: {
        service: "mbk-foods-api"
    },

    transports: [
        new transports.Console()
    ]
});

module.exports = logger;