const express = require("express");

const loggerMiddleware = require("./middlewares/logger.middleware");
const requestTimeMiddleware = require("./middlewares/requestTime.middleware");

const routes = require("./routes");

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.use(requestTimeMiddleware);

app.use("/", routes);

module.exports = app;