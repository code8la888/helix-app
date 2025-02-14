const strain = require("../models/strain");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, tel, dept, role, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ExpressError("此 Email 已經被註冊!", 409));
    }

    const user = new User({
      username,
      email,
      tel,
      dept,
      role,
    });
    const registeredUser = await User.register(user, password);

    res.status(200).json({
      message: "註冊成功，請重新登入!",
      data: registeredUser,
      redirect: "/login",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.login = (req, res, next) => {
  if (!req.user) {
    return next(new ExpressError("登入失敗，請確認帳號密碼是否正確!", 401));
  }

  const redirectUrl = res.locals.returnTo || "/dashboard";
  res.status(200).json({
    success: true,
    message: "成功登入，歡迎回來!",
    redirect: redirectUrl,
  });
};

module.exports.editUser = async (req, res, next) => {
  try {
    const { role, tel, dept } = req.body;
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { tel, dept, role },
      { new: true }
    );

    if (!updatedUser) {
      return next(new ExpressError("找不到該使用者", 404));
    }

    res
      .status(200)
      .json({ message: "成功更新使用者資訊!", redirect: "/dashboard" });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("req.user", req.user);

    if (req.user.id !== userId) {
      return next(new ExpressError("您無權刪除此帳戶", 403));
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return next(new ExpressError("找不到該使用者", 404));
    }

    await strain.updateMany({ users: userId }, { $pull: { users: userId } });

    res.status(200).json({
      message: "帳戶及相關資料已成功刪除",
      redirect: "/home",
    });
  } catch (error) {
    console.error("刪除帳戶發生錯誤:", error);
    next(error);
  }
};
