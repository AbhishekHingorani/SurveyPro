const express = require("express");
const router = express.Router();
const { issueJWT } = require("../lib/utils");
const passport = require("passport");

// Local login API. This API returns JWT token if the user creds are correct.
router.post("/login", passport.authenticate("local", {}), (req, res, next) => {
  res.send(issueJWT(req.user));
});

// Local registration API. This API registers user and returns token.
// If the user already exists then it returns the token of pre-registered user.
router.post(
  "/register",
  passport.authenticate("register", {}),
  (req, res, next) => {
    res.send(issueJWT(req.user));
  }
);

// Google login API. This API uses passport google to redirect user to google login page.
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// After successful google login, this callback api is called by google.
// We send the token to the google popup window that is opened by our app.
// This token is then thrown to our main app, which is listening to the child google window.
router.get(
  "/login/google/callback",
  passport.authenticate("google", { failureRedirect: "/login/fail" }),
  (req, res, next) => {
    var responseHTML =
      '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
    responseHTML = responseHTML.replace(
      "%value%",
      JSON.stringify({
        token: issueJWT(req.user),
      })
    );
    res.status(200).send(responseHTML);
  }
);

// If google login fails, we are redirected to this api.
router.get("/login/fail", (req, res, next) => {
  res.send("login failed");
});

module.exports = router;
