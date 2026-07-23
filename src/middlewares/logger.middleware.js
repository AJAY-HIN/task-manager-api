function loggerMiddleware(req, res, next) {
    console.log("========== REQUEST ==========");
    console.log(`${req.method} ${req.url}`);
    console.log("=============================");

    next();
}

module.exports = loggerMiddleware;