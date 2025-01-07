const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const psssport = require("passport");
const { storeReturnTo } = require("../middleware");

// router.get("/register", users.renderRegister);

router.post("/api/register", catchAsync(users.register));

// router.get("/login", users.renderLogin);

router.post(
  "/api/login",
  storeReturnTo,
  psssport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

router.get("/api/logOut", users.logout);

module.exports = router;
