const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const { handleErrors } = require("../controllers/error");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

router.post("/api/register", catchAsync(users.register));

router.post("/api/login", storeReturnTo, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next({
        name: "AuthenticationError",
        message: "使用者名稱或密碼錯誤",
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

router.get("/api/logOut", users.logout);

router.use(handleErrors);

module.exports = router;
