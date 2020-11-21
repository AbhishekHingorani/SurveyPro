module.exports = (req, res, next) => {
    const createError = require('http-errors');
    next(createError(404));
}