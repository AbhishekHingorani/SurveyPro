const express = require('express');
const router = express.Router();
const { issueJWT } = require('../lib/utils');
const passport = require('passport');

router.post('/login', passport.authenticate('local', {}), (req, res, next) => {
    res.send(issueJWT(req.user));
});

router.post('/register', passport.authenticate('register', {}), (req, res, next) => {
    res.send(issueJWT(req.user));
});

router.get('/login/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/login/google/callback', passport.authenticate('google', {failureRedirect: '/login/fail'}), (req, res, next) => {
    var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
    responseHTML = responseHTML.replace('%value%', JSON.stringify({
        token: issueJWT(req.user)
    }));
    res.status(200).send(responseHTML);
});

router.get('/login/fail', (req, res, next) => {
    res.send('login failed');
});

module.exports = router;