const express = require('express');
const morgan = require('morgan');
const handler404 = require('./middleware/handle404');
const errorHandler = require('./middleware/error-handler');
const healthcheck = require('./controller/healthcheck');
const form = require('./controller/form');
const passport = require('./config/passport');
const login = require('./controller/login');
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));


app.use(healthcheck);
app.use(cors({origin: 'http://localhost:4200'}));
app.use(passport.initialize());
app.use(login);
app.use(form);
app.use(handler404);
app.use(errorHandler);

module.exports = app;