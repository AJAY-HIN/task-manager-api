const express = require("express");

const app = express();

// Built-in middleware to parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Task Manager API is running"
    });
});

module.exports = app;