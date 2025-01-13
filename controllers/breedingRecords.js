const Strain = require("../models/strain");
const BreedingRecord = require("../models/breedingRecord");
const on_shelf = ["在架上", "已關閉"];

module.exports.renderNewForm = (req, res) => {
  const { strainId } = req.params;
  res.render("breedingRecords/new", { strainId });
};

module.exports.createBreedingRecord = async (req, res) => {
  const { strainId } = req.params;
  const breedingRecord = new BreedingRecord({
    ...req.body.breedingRecord,
    strain: strainId,
  });
  const strain = await Strain.findById(strainId);
  strain.breedingRecords.push(breedingRecord);
  await breedingRecord.save();
  await strain.save();
  // req.flash("success", "成功新增繁殖記錄");
  // res.redirect(`/strains/${strainId}`);
  res
    .status(200)
    .json({ message: "成功新增繁殖記錄", redirect: `/strains/${strainId}` });
};

module.exports.renderEditForm = async (req, res) => {
  const { strainId, breedingRecordId } = req.params;
  const breedingRecord = await BreedingRecord.findById(breedingRecordId);
  res.render("breedingRecords/edit", { breedingRecord, strainId, on_shelf });
};

module.exports.updateBreedingRecord = async (req, res) => {
  const { strainId, breedingRecordId } = req.params;
  await BreedingRecord.findByIdAndUpdate(
    breedingRecordId,
    req.body.breedingRecord
  );
  req.flash("success", "成功修改繁殖記錄");
  res.redirect(`/strains/${strainId}`);
};

module.exports.deleteBreedingRecord = async (req, res) => {
  const { strainId, breedingRecordId } = req.params;
  await BreedingRecord.findByIdAndDelete(breedingRecordId);
  req.flash("success", "成功刪除繁殖記錄");
  res.redirect(`/strains/${strainId}`);
};
