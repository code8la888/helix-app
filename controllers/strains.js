const User = require("../models/user");
const Strain = require("../models/strain");
const Mouse = require("../models/mouse");
const BreedingRecord = require("../models/breedingRecord");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res, next) => {
  try {
    const { role, name } = req.user;

    let query = {}; // 預設查詢條件

    if (!["品系管理人", "獸醫"].includes(role)) {
      query = { users: name };
    }

    const strains = await Strain.find(query);
    const strainsWithUsers = await Promise.all(
      strains.map(async (strain) => {
        const users = await User.find({ name: { $in: strain.users } });
        return {
          ...strain.toObject(), // 將 Mongoose 文件轉換為普通物件
          users, // 關聯的使用者資料
        };
      })
    );

    res.status(200).json({ strainsWithUsers });
  } catch (error) {
    next(error);
  }
};

module.exports.createNewStrain = async (req, res) => {
  if (!req.body.strain) throw new ExpressError("無效的表單或不完整的表單", 400);
  const { strain } = req.body;
  const newStrain = new Strain({
    strain: strain.strain,
    abbr: strain.abbr,
    iacuc_no: strain.iacuc_no,
    dept: strain.dept,
    EXP: strain.EXP,
    genes: strain.genes,
  });
  if (strain.users && Array.isArray(strain.users)) {
    for (let name of strain.users) {
      const user = await User.findOne({ name });
      if (!user) {
        throw new ExpressError(
          `使用者 ${name} 不存在，請先註冊使用者帳戶`,
          400
        );
      }
      newStrain.users.push(user.name);
    }
  }
  await newStrain.save();
  res
    .status(200)
    .json({ message: "成功新增特殊品系資訊", redirect: "/strains/index" });
};

module.exports.showStrain = async (req, res) => {
  const { strainId } = req.params;
  const strain = await Strain.findById(strainId);
  const mice = await Mouse.find({ strain: strainId });
  const users = await User.find({ name: { $in: strain.users } });
  const breedingRecords = await BreedingRecord.find({ strain: strainId });
  res.status(200).json({ strain, mice, users, strainId, breedingRecords });
};

module.exports.updateStrain = async (req, res) => {
  const { strainId } = req.params;
  const { strain } = req.body;
  const updatedStrain = {
    strain: strain.strain,
    abbr: strain.abbr,
    iacuc_no: strain.iacuc_no,
    dept: strain.dept,
    EXP: strain.EXP,
    genes: strain.genes,
    users: [],
  };
  if (strain.users && Array.isArray(strain.users)) {
    for (let name of strain.users) {
      const user = await User.findOne({ name });
      if (!user) {
        throw new ExpressError(
          `使用者 ${name} 不存在，請先註冊使用者帳戶`,
          400
        );
      }
      updatedStrain?.users.push(user.name);
    }
  }
  await Strain.findByIdAndUpdate(strainId, updatedStrain);
  res
    .status(200)
    .json({ message: "成功修改品系資訊", redirect: `/strains/${strainId}` });
};

module.exports.deleteStrain = async (req, res) => {
  const { strainId } = req.params;
  await Strain.findByIdAndDelete(strainId);
  await Mouse.deleteMany({ strain: strainId });
  await BreedingRecord.deleteMany({ strain: strainId });
  res
    .status(200)
    .json({ message: "成功刪除品系及相關數據", redirect: "/strains/index" });
};
