const Strain = require("../models/strain");
const Mouse = require("../models/mouse");

module.exports.renderNewForm = async (req, res) => {
  const { strainId } = req.params;
  const strain = await Strain.findById(strainId);
  res.status(200).json({ strainId, strain });
};

module.exports.createNewMouse = async (req, res) => {
  const { strainId } = req.params;
  const mouse = new Mouse({
    ...req.body.mouse,
  });
  const strain = await Strain.findById(strainId);
  strain.mice.push(mouse);
  await strain.save();
  await mouse.save();
  res
    .status(200)
    .json({ message: "成功新增採樣紀錄", redirect: `/strains/${strainId}` });
};

module.exports.renderEditForm = async (req, res) => {
  const { strainId, mouseId } = req.params;
  const mouse = await Mouse.findById(mouseId);
  const strain = await Strain.findById(strainId);
  res.status(200).json({ mouse, strain });
};

module.exports.updateMouse = async (req, res) => {
  const { strainId, mouseId } = req.params;
  await Mouse.findByIdAndUpdate(mouseId, req.body.mouse);
  res
    .status(200)
    .json({ message: "成功修改採樣紀錄", redirect: `/strains/${strainId}` });
};

module.exports.deleteMouse = async (req, res) => {
  const { strainId, mouseId } = req.params;
  await Strain.findByIdAndUpdate(strainId, { $pull: { mice: mouseId } });
  await Mouse.findByIdAndDelete(mouseId);
  res
    .status(200)
    .json({ message: "成功刪除採樣紀錄", redirect: `/strains/${strainId}` });
};
