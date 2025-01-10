const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

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
      req.flash("success", "歡迎來到LIMS");
      res.status(201).json({
        message: "成功新增使用者",
        data: registeredUser,
        redirect: "/index",
      });
    });
  } catch (error) {
    req.flash("error", error);
    res.status(400).json({ error: error.message, redirect: "/register" });
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  console.log(req.user);
  req.flash("success", "歡迎回來");
  // const redirectUrl = res.locals.returnTo || "/strains";
  // res.redirect(redirectUrl);
  res.redirect("/");
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "再見!");
    res.redirect("/strains");
  });
};
