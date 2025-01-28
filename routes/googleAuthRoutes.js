const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

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
      if (!user.role || user.role.trim() === "") {
        return res.redirect("/profile");
      }
      res.redirect("/strains/index");
    });
  })(req, res, next);
});

router.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/api/current_user", (req, res) => {
  res.send(req.user || null);
  console.log(`使用者資訊:, ${req.user}`);
});

router.put(`/api/users`, async (req, res) => {
  const { role, tel, dept, _id } = req.body;
  await User.findByIdAndUpdate(_id, { tel, dept, role });
  res.status(200).json({ message: "更新成功!", redirect: `/strains/index` });
});

module.exports = router;
