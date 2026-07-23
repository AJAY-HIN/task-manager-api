const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_NAME && process.env.DATABASE_USER) {
    sequelize = new Sequelize(
        process.env.DATABASE_NAME,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        {
            host: process.env.DATABASE_HOST || "localhost",
            port: process.env.DATABASE_PORT || 5432,
            dialect: "postgres",
            logging: false
        }
    );
} else {
    // Fallback to SQLite in-memory database so the app runs out-of-the-box
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });
}

module.exports = sequelize;
