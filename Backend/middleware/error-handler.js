module.exports = (err, req, res, next) => {
  // If there are any errors in the app, this method will be called.
  //logging the error to console for easier debugging.
  console.log("%j", err);
  res.status(err.status || 500);
  res.send(err);
};
