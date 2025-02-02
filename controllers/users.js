const User = require("../models/user");

module.exports.register = async (req, res) => {
  try {
    const { username, email, tel, dept, role, password } = req.body;
    const user = new User({
      username,
      email,
      tel,
      dept,
      role,
    });
    const registeredUser = await User.register(user, password);
    await registeredUser.save();

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        success: true,
        message: "註冊成功!歡迎來到Helix LIMS",
        data: registeredUser,
        redirect: "/dashboard",
      });
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: error.message, redirect: "/register" });
  }
};

module.exports.login = (req, res) => {
  try {
    const redirectUrl = res.locals.returnTo || "/dashboard";
    res.status(200).json({
      success: true,
      message: "成功登入，歡迎回來!",
      redirect: redirectUrl,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/home");
  });
};
