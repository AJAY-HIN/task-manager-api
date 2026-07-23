const express = require("express");

const loggerMiddleware = require("./middlewares/logger.middleware");
const requestTimeMiddleware = require("./middlewares/requestTime.middleware");

const routes = require("./routes");

const app = express();

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(loggerMiddleware);

app.use(requestTimeMiddleware);

app.use("/", routes);

module.exports = app;