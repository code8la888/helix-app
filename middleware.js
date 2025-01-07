const User = require("./models/User");
const Strain = require("./models/strain");
const { strainSchema } = require("./schema.js");
const { mouseSchema } = require("./schema.js");
const { breedingRecordSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "請先登入");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.verifyBrowsePermission = async (req, res, next) => {
  const { strainId } = req.params;
  const user = req.user;
  try {
    const strain = await Strain.findById(strainId);
    if (!strain) {
      req.flash("error", "找不到該品系相關資料!");
      return res.redirect("/strains");
    }

    const dbUser = await User.findOne({ username: user.username });
    if (!dbUser) {
      req.flash("error", "使用者資料不存在");
      return res.redirect("/strains");
    }

    if (
      user.role === "獸醫" ||
      (!strain.users.includes(user.username) && user.role === "品系管理人")
    ) {
      if (req.method === "GET") {
        return next();
      } else {
        req.flash("error", "您沒有權限修改或刪除該品系資料!");
        return res.redirect(`/strains/${strainId}`);
      }
    }

    if (!strain.users.includes(user.username)) {
      req.flash("error", "您不屬於該計畫的使用者");
      return res.redirect("/strains");
    }

    if (dbUser.role === "品系管理人") {
      return next();
    }

    if (["計畫主持人", "學生", "研究助理"].includes(dbUser.role)) {
      if (req.method !== "GET") {
        req.flash("error", "您沒有權限修改或刪除該品系資料");
        return res.redirect(`/strains/${strainId}`);
      }
      return next(); // 允許檢視資料
    }

    req.flash("error", "您沒有權限修改或刪除該品系資料!");
    return res.redirect("/strains");
  } catch (error) {
    next(error);
  }
};

module.exports.verifyEditPermission = async (req, res, next) => {
  const { strainId } = req.params;
  const user = req.user;
  try {
    const strain = await Strain.findById(strainId);
    if (!strain) {
      req.flash("error", "找不到該品系相關資料!");
      return res.redirect("/strains");
    }

    const dbUser = await User.findOne({ username: user.username });
    if (!dbUser) {
      req.flash("error", "使用者資料不存在");
      return res.redirect("/strains");
    }

    if (strain.users.includes(user.username) && user.role === "品系管理人") {
      return next();
    }
    req.flash("error", "您沒有權限修改或刪除該品系資料!");
    return res.redirect(`/strains/${strainId}`);
  } catch (error) {
    next(error);
  }
};

module.exports.verifyAdmin = async (req, res, next) => {
  const user = req.user;
  try {
    const dbUser = User.findById(user._id);
    if (!dbUser) {
      req.flash("error", "不存在此使用者!");
      res.redirect("/strains");
    }

    if (user.role === "品系管理人") {
      return next();
    }

    req.flash("error", "你不具有此編輯權限!");
    res.redirect("/strains");
  } catch (error) {
    next(error);
  }
};

module.exports.validStrain = (req, res, next) => {
  const { error } = strainSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateMouse = (req, res, next) => {
  req.body.mouse.strain = req.params.strainId;
  const { error } = mouseSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validBreedingRecord = (req, res, next) => {
  req.body.breedingRecord.strain = req.params.strainId;
  const { error } = breedingRecordSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
