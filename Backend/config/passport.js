const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./connection");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const crypto = require("crypto");
const { secret } = require("./config");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { googleClientId, googleClientSecret } = require("./config");

// passport local stratery configuration for local login
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      // get user with given username and password and check if it exists.
      const query =
        'SELECT * FROM Users WHERE Email = "' +
        email +
        '" AND Password = MD5("' +
        password +
        '")';
      connection.query(query, function (err, results, fields) {
        if (err) return done(err);

        const user = results[0];
        if (!user) {
          return done(null, false, { message: "Incorrect Credentials." });
        }
        return done(null, user);
      });
    }
  )
);

// passport local stratergy for registering user.
passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      // First check if the user already exists or not.
      connection.query(
        'SELECT UserId, Email FROM Users WHERE Email = "' + email + '"',
        function (err, results, fields) {
          const user = results[0];
          if (err) {
            return done(err, false);
          }
          if (user) {
            // if user already exists then return the user directly.
            return done(null, user);
          } else {
            // if user does not exists then insert it in the database.
            let data = {
              Email: email,
              Password: crypto.createHash("MD5").update(password).digest("hex"),
            };
            connection.query(
              "INSERT INTO Users SET ?",
              data,
              (error, results, fields) => {
                if (error) throw error;
                data.UserId = results.insertId;
                return done(null, data);
              }
            );
          }
        }
      );
    }
  )
);

// Used internally be passport to serialize the user.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// Used internally be passport to serialize the user.
passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

// Options for passport JWT stratergy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: secret,
};

// Passport JWT stratergy to authenticate all the incoming requests and validate the token in request header.
passport.use(
  "jwt",
  new JwtStrategy(options, function (jwt_payload, done) {
    // We will assign the `id` property on the JWT to the database ID of user
    connection.query(
      "SELECT UserId, Email FROM Users WHERE UserId = " + jwt_payload.id,
      function (err, results, fields) {
        const user = results[0];
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    );
  })
);

// Options of passport google auth
const googleOpts = {
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: "http://localhost:8989/login/google/callback",
};

// Passport google auth stratergy
passport.use(
  "google",
  new GoogleStrategy(googleOpts, function (token, tokenSecret, profile, done) {
    const email = profile.emails[0].value;

    // First check if user already exists in the database.
    connection.query(
      'SELECT UserId, Email FROM Users WHERE Email = "' + email + '"',
      function (err, results, fields) {
        const user = results[0];
        if (err) {
          return done(err, false);
        }
        if (user) {
          // If user already exists then return the user.
          return done(null, user);
        } else {
          // If user does not exist then insert it to database.
          let data = { Email: email };
          connection.query(
            "INSERT INTO Users SET ?",
            data,
            (error, results, fields) => {
              if (error) throw error;
              data.UserId = results.insertId;
              return done(null, data);
            }
          );
        }
      }
    );
  })
);

module.exports = passport;
