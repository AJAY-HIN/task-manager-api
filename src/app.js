const express = require('express');

const loggerMiddleware = require('./middlewares/logger.middleware');
const requestTimeMiddleware = require('./middlewares/requestTime.middleware');

const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const helmet = require('helmet');
const cors = require('cors');
const { apiRateLimiter } = require('./middlewares/rateLimit.middleware');
const env = require('./config/env');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(
  express.json({
    limit: '1mb',
  })
);
app.use(apiRateLimiter);

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(loggerMiddleware);

app.use(requestTimeMiddleware);

app.use('/', routes);
app.use(errorHandler);

module.exports = app;
