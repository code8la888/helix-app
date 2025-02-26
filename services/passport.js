const passport = require("passport");
const GoogleStragety = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local");
const mongoose = require("mongoose");
const keys = require("../config/keys");
require("../models/user");
const User = mongoose.model("User");

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
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      console.log(profile);
      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        googleId: profile.id,
        username: profile.emails[0].value, //使用者帳號信箱
        name: profile.displayName, //使用者姓名
      });
      user.save();
      done(null, user);
    }
  )
);

passport.use(new localStrategy(User.authenticate()));
