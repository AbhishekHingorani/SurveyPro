module.exports = (req, res, next) => {
  // Fallback API to throw 404 error.
  const createError = require("http-errors");
  next(createError(404));
};
