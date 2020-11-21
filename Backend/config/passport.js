const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./connection');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const crypto = require('crypto');
const {secret} = require('./config');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { googleClientId, googleClientSecret} = require('./config');

passport.use('local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    const query = 'SELECT * FROM Users WHERE Email = "' + email + '" AND Password = MD5("' + password + '")';
    connection.query(query, function(err, results, fields) {
      if (err)
        return done(err);
      
      const user = results[0];
      if (!user) {
        return done(null, false, { message: 'Incorrect Credentials.' });
      }
      return done(null, user);
    });
  }
));

passport.use('register', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    connection.query('SELECT UserId, Email FROM Users WHERE Email = "'+ email + '"', function(err, results, fields) {
      const user = results[0];
      // This flow look familiar?  It is the same as when we implemented
      // the `passport-local` strategy
      if (err) {
          return done(err, false);
      }
      if (user) {
          return done(null, user);
      } else {
        let data = {
          Email: email, 
          Password: crypto.createHash('MD5').update(password).digest('hex')
        };
        connection.query('INSERT INTO Users SET ?', data, (error, results, fields) => {
          if (error) throw error;
          data.UserId = results.insertId;
          console.log("Data Id:::", results);
          return done(null, data);
        });
      }
      
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

// At a minimum, you must pass these options (see note after this code snippet for more)
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: secret
};

// The JWT payload is passed into the verify callback
passport.use('jwt', new JwtStrategy(options, function(jwt_payload, done) {
  console.log("JWT_PAYLOAD::::" , jwt_payload);  
  // We will assign the `sub` property on the JWT to the database ID of user
   connection.query('SELECT UserId, Email FROM Users WHERE UserId = '+ jwt_payload.id, function(err, results, fields) {
    console.log("RES::::" , results);  
        const user = results[0];
        // This flow look familiar?  It is the same as when we implemented
        // the `passport-local` strategy
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
        
    });
    
}));

const googleOpts =  {
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: "http://localhost:8989/login/google/callback"
}

passport.use('google', new GoogleStrategy( googleOpts, function(token, tokenSecret, profile, done) {
    const email = profile.emails[0].value;
  
    connection.query('SELECT UserId, Email FROM Users WHERE Email = "'+ email + '"', function(err, results, fields) {
      const user = results[0];
      // This flow look familiar?  It is the same as when we implemented
      // the `passport-local` strategy
      if (err) {
          return done(err, false);
      }
      if (user) {
          return done(null, user);
      } else {
        let data = {Email: email};
          connection.query('INSERT INTO Users SET ?', data, (error, results, fields) => {
            if (error) throw error;
            data.UserId = results.insertId;
            console.log("Data Id:::", results);
            return done(null, data);
          });
      }
      
  });
  }
));

module.exports = passport;