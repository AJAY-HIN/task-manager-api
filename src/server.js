const app = require("./app");
const config = require("./config/env");
const sequelize = require("./database/sequelize");

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");
        
        // Sync models
        await sequelize.sync();
        console.log("Database models synchronized.");

        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    } catch (error) {
        console.error("Unable to start the server:", error);
        process.exit(1);
    }
}

startServer();