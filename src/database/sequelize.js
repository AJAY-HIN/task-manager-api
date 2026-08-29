const { Sequelize } = require('sequelize');
const config = require('../config/env');

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: false,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;

// const { Sequelize } = require("sequelize");

// let sequelize;

// if (process.env.DATABASE_NAME && process.env.DATABASE_USER) {
//     sequelize = new Sequelize(
//         process.env.DATABASE_NAME,
//         process.env.DATABASE_USER,
//         process.env.DATABASE_PASSWORD,
//         {
//             host: process.env.DATABASE_HOST || "localhost",
//             port: process.env.DATABASE_PORT || 5432,
//             dialect: "postgres",
//             logging: false
//         }
//     );
// } else {
//     // Fallback to SQLite in-memory database so the app runs out-of-the-box
//     sequelize = new Sequelize({
//         dialect: "sqlite",
//         storage: ":memory:",
//         logging: false
//     });
// }

// module.exports = sequelize;
