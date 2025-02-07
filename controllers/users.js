const strain = require("../models/strain");
const User = require("../models/user");
const mongoose = require("mongoose");

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
        message: "註冊成功 ! 歡迎來到Helix LIMS",
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

module.exports.editUser = async (req, res) => {
  const { role, tel, dept, _id } = req.body;
  await User.findByIdAndUpdate(_id, { tel, dept, role });
  res
    .status(200)
    .json({ message: "成功更新使用者資訊!", redirect: `/dashboard` });
};

module.exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "無效的使用者 ID" });
    }

    if (req.user.id !== userId) {
      return res.status(403).json({ message: "您無權刪除此帳戶" });
    }

    await User.findByIdAndDelete(userId);
    await strain.updateMany({ users: userId }, { $pull: { users: userId } });

    res.json({ message: "帳戶及相關資料已成功刪除" });
  } catch (error) {
    console.error("刪除帳戶錯誤:", error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
};
