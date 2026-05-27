require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const path = require("path");

const { appError, notFound } = require("./middleware/errorMiddleware");
const router = require("./route");
const pool = require("./config/database.config");
const requestLogger = require("./middleware/requestLogger");
const logger = require("./config/logger");
const httpStatus = require("./constants/httpStatus");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(requestLogger);

app.get("/healthz", (req, res) => {
    res.json({
        status: httpStatus.OK,
        ip: req.ip,
        msg: "Server health check 100%"
    });
});

app.use(router);

app.use(notFound);
app.use(appError);

const PORT = process.env.PORT || 3060;

let server;

async function startServer() {
    const now = new Date();

    try {
        if (process.env.REQUIRE_DB_ON_START === "true") {
            await pool.query("SELECT 1");
            logger.info("Database connection verified");
        }

        server = app.listen(PORT, () => {
            logger.info({
                message: "Server started",
                port: PORT,
                startedAt: now.toISOString()
            });
        });

    } catch (error) {
        logger.error({
            message: "Server failed to start",
            startedAt: now.toISOString(),
            error: error.message,
            stack: error.stack
        });

        process.exit(1);
    }
}

process.on("uncaughtException", err => {
    logger.error({
        type: "UNCAUGHT_EXCEPTION",
        message: err.message,
        stack: err.stack
    });

    process.exit(1);
});

process.on("unhandledRejection", err => {
    logger.error({
        type: "UNHANDLED_REJECTION",
        message: err.message,
        stack: err.stack
    });

    process.exit(1);
});

async function gracefulShutdown(signal) {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    if (!server) {
        await pool.end();
        process.exit(0);
    }

    // stop accepting new requests
    server.close(async () => {
        logger.info("HTTP server closed");

        try {
            // close database connections
            await pool.end();

            logger.info("Database pool closed");

            process.exit(0);

        } catch (err) {
            logger.error({
                message: "Error closing resources",
                error: err.message,
                stack: err.stack
            });

            process.exit(1);
        }
    });

    // force shutdown after 10 seconds
    setTimeout(() => {
        logger.error("Forced shutdown after timeout");

        process.exit(1);
    }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();
