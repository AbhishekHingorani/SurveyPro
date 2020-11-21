const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/formList', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.user);
        // Send the route data 
        const data = {data: 'formlist'}
        res.status(200).send(data);
    } else {
        // Not authorized
        res.status(401).send('You are not authorized to view this');
    }
});

module.exports = router;