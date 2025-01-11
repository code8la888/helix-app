const Strain = require("../models/strain");
const Mouse = require("../models/mouse");
const genders = ["F", "M"];
const result = ["WT", "HT", "KO", "檢測中"];
const state = ["在架上", "已移出", "已犧牲", "自然死亡"];

module.exports.renderNewForm = async (req, res) => {
  const { strainId } = req.params;
  const strain = await Strain.findById(strainId);
  res.render("mice/new", { strainId, strain });
};

module.exports.createNewMouse = async (req, res) => {
  const { strainId } = req.params;
  const mouse = new Mouse({
    ...req.body.mouse,
    strain: strainId,
  });
  const strain = await Strain.findById(strainId);
  strain.mice.push(mouse);
  await strain.save();
  await mouse.save();
  // req.flash("success", "成功新增採樣記錄");
  res
    .status(200)
    .json({ message: "成功新增採樣記錄", redirect: `/strains/${strainId}` });
};

module.exports.renderEditForm = async (req, res) => {
  const { strainId, mouseId } = req.params;
  const mouse = await Mouse.findById(mouseId);
  const strain = await Strain.findById(strainId);
  res.render("mice/edit", {
    mouse,
    strainId,
    strain,
    genders,
    state,
    result,
  });
};

module.exports.updateMouse = async (req, res) => {
  const { strainId, mouseId } = req.params;
  await Mouse.findByIdAndUpdate(mouseId, req.body.mouse);
  req.flash("success", "成功修改採樣記錄");
  res.redirect(`/strains/${strainId}`);
};

module.exports.deleteMouse = async (req, res) => {
  const { strainId, mouseId } = req.params;
  await Strain.findByIdAndUpdate(strainId, { $pull: { mice: mouseId } });
  await Mouse.findByIdAndDelete(mouseId);
  req.flash("success", "成功刪除採樣記錄");
  res.redirect(`/strains/${strainId}`);
};
