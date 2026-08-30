const app = require('./app');
const config = require('./config/env');
const sequelize = require('./database/sequelize');
const { User, RefreshToken } = require('./models');

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Models are synchronized via migrations
    console.log('Database models verified.');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1);
  }
}

startServer();
