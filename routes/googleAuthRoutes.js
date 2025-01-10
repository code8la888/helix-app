const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    req.flash("success", "歡迎回來");
    res.redirect("/index");
  }
);

router.get("/api/logout", (req, res) => {
  req.logout();
  req.flash("success", "再見");
  res.redirect("/");
});

router.get("/api/current_user", (req, res) => {
  res.send(req.user);
  console.log(req.user);
});

module.exports = router;
