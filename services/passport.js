const passport = require("passport");
const GoogleStragety = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local");
const mongoose = require("mongoose");
const keys = require("../config/keys");
require("../models/user");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStragety(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      console.log(profile);
      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
      });
      user.save();
      done(null, user);
    }
  )
);

passport.use(new localStrategy(User.authenticate()));
