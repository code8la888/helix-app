const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Google 登入失敗，請重試！",
        redirect: "/login",
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/index");
    });
  })(req, res, next);
});

router.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/api/current_user", (req, res) => {
  res.send(req.user);
  console.log(req.user);
});

module.exports = router;
