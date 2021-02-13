const logger = (req, res, next) => {
    console.log(
        `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`.green.underline
    );
    next();
}

module.exports = logger;