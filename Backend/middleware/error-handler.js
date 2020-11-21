module.exports = (err, req, res, next) => {
    console.log('%j', err);
    res.status(err.status || 500);
    res.send(err);
}