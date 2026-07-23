const express = require("express");

const router = express.Router();
const userRoutes = require("./user.routes");

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Task Manager API is running",
        requestTime: req.requestTime
    });
});

router.use("/api/v1/users", userRoutes);

module.exports = router;