const jsonwebtoken = require("jsonwebtoken");
const { secret } = require("../config/config");

// This method uses the JsonWebToken library to convert user to a vaild JWT.
// It generates a JWT and token expiration time.
function issueJWT(user) {
  const _id = user.UserId;
  const expiresIn = "1d";

  const payload = {
    id: _id,
    iat: Date.now(),
  };
  const signedToken = jsonwebtoken.sign(payload, secret, {
    expiresIn: expiresIn,
  });

  return {
    token: "JWT " + signedToken,
    expires: expiresIn,
  };
}

module.exports = { issueJWT };
