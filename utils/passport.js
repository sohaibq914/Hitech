const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const oAuth = require("../utils/oAuth");
const user = require("../models/user");

exports.passportInit = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(User.createStrategy());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.GOOGLE_CALLBACK_URL}/auth/google/callback`,
        passReqToCallback: true,
      },
      oAuth.authUser
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
