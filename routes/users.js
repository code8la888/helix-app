const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");
const { handleErrors } = require("../controllers/error");
const {
  storeReturnTo,
  validateObjectId,
  validateUser,
} = require("../middleware");

// google登入
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
      res.redirect("/dashboard");
    });
  })(req, res, next);
});

//本地註冊
router.post("/api/register", validateUser, catchAsync(users.register));

//本地登入
router.post("/api/login", storeReturnTo, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next({
        name: "AuthenticationError",
        message: "使用者名稱或密碼錯誤，請重試!",
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      users.login(req, res, next);
    });
  })(req, res, next);
});

//登出
router.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect("/home");
});

//取得當前使用者資訊
router.get("/api/current_user", (req, res) => {
  res.send(req.user || null);
  console.log(`使用者資訊:, ${req.user}`);
});

//編輯使用者資訊
router.put(`/api/users`, validateUser, catchAsync(users.editUser));

//刪除使用者
router.delete(
  "/api/users/:userId",
  validateObjectId,
  catchAsync(users.deleteUser)
);

router.use(handleErrors);

module.exports = router;
