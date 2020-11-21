const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config/config');

function issueJWT(user) {
  const _id = user.UserId;
  const expiresIn = '1d';
  
  const payload = {
    id: _id,
    iat: Date.now()
  };
  const signedToken = jsonwebtoken.sign(payload, secret, { expiresIn: expiresIn });

  return {
    token: "JWT " + signedToken,
    expires: expiresIn
  }
}

module.exports = {issueJWT};