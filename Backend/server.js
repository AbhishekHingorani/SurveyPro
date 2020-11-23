const express = require("express");
const morgan = require("morgan");
const handler404 = require("./middleware/handle404");
const errorHandler = require("./middleware/error-handler");
const healthcheck = require("./controller/healthcheck");
const form = require("./controller/form");
const passport = require("./config/passport");
const login = require("./controller/login");
var cors = require("cors");

// initializing express.
const app = express();
app.use(express.json());
// Adding morgan as dev dependency for better debugging.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use(healthcheck);
// Enabling CORS for Angular frontend
app.use(cors({ origin: "http://localhost:4200" }));
// Initializing passport.
app.use(passport.initialize());
// Initializing controllers/middleware.
app.use(login);
app.use(form);
app.use(handler404);
app.use(errorHandler);

module.exports = app;
