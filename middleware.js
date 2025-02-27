const User = require("./models/user");
const Strain = require("./models/strain");
const { strainSchema } = require("./schema.js");
const { mouseSchema } = require("./schema.js");
const { breedingRecordSchema } = require("./schema");
const { userSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.user) {
    req.session.returnTo = req.originalUrl;
    return next(new ExpressError("請先登入以訪問此頁面", 401));
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
      return next(new ExpressError("找不到該品系相關資料!", 404));
    }

    const dbUser = await User.findOne({ name: user.name });
    if (!dbUser) {
      return next(new ExpressError("使用者資料不存在!", 400));
    }

    if (dbUser.role === "品系管理人" || user.role === "獸醫") {
      return next();
    }

    if (!strain.users.includes(user.name)) {
      return next(
        new ExpressError("您不屬於該計畫的使用者!您無法瀏覽該品系資料", 403)
      );
    }
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports.verifyEditPermission = async (req, res, next) => {
  const { strainId } = req.params;
  const user = req.user;
  console.log("user:", user);

  try {
    const strain = await Strain.findById(strainId);
    if (!strain) {
      return next(new ExpressError("找不到該品系相關資料!", 404));
    }

    const dbUser = await User.findOne({ name: user.name });
    if (!dbUser) {
      return next(new ExpressError("使用者資料不存在!", 400));
    }

    if (strain.users.includes(user.name) && user.role === "品系管理人") {
      return next();
    }
    return next(new ExpressError("⛔您沒有權限訪問或編輯此頁面", 403));
  } catch (error) {
    next(error);
  }
};

module.exports.validStrain = (req, res, next) => {
  const { error } = strainSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(msg, 400));
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
    return next(new ExpressError(msg, 400));
  } else {
    next();
  }
};

module.exports.validBreedingRecord = (req, res, next) => {
  const { error } = breedingRecordSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(msg, 400));
  } else {
    next();
  }
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  console.log("錯誤訊息:", error);

  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(msg, 400));
  }
  next();
};

module.exports.validateObjectId = (req, res, next) => {
  const { strainId, breedingRecordId, mouseId, userId, id } = req.params;
  for (const [key, value] of Object.entries({
    strainId,
    breedingRecordId,
    mouseId,
    userId,
    id,
  })) {
    if (value && !mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({ message: `無效的 ${key} ID` });
    }
  }
  next();
};
