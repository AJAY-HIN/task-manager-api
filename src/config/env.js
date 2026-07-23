const dotenv = require("dotenv");

dotenv.config();

if (!process.env.PORT) {
    throw new Error("PORT environment variable is required.");
}

const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT)
};

module.exports = config;