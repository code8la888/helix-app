const passport = require("passport");
const GoogleStragety = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local");
const mongoose = require("mongoose");
const keys = require("../config/keys");

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
      });
      user.save();
      done(null, user);
    }
  )
);

passport.use(new localStrategy(User.authenticate()));
// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username });
//       if (!user) {
//         return done(null, false, { message: "用戶名或密碼錯誤" });
//       }

//       // 假設 User 模型有驗證密碼的方法
//       const isMatch = await user.verifyPassword(password);
//       if (!isMatch) {
//         return done(null, false, { message: "用戶名或密碼錯誤" });
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   })
