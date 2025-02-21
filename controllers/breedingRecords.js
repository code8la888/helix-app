const Strain = require("../models/strain");
const BreedingRecord = require("../models/breedingRecord");

module.exports.renderNewForm = (req, res) => {
  const { strainId } = req.params;
  res.render("breedingRecords/new", { strainId });
};

module.exports.createBreedingRecord = async (req, res) => {
  const { strainId } = req.params;
  const breedingRecord = new BreedingRecord({
    ...req.body.breedingRecord,
  });
  const strain = await Strain.findById(strainId);
  strain.breedingRecords.push(breedingRecord);
  await breedingRecord.save();
  await strain.save();
  res
    .status(200)
    .json({ message: "成功新增繁殖紀錄", redirect: `/strains/${strainId}` });
};

module.exports.renderEditForm = async (req, res) => {
  const { strainId, breedingRecordId } = req.params;
  const breedingRecord = await BreedingRecord.findById(breedingRecordId);
  res.status(200).json({ breedingRecord });
};

module.exports.updateBreedingRecord = async (req, res) => {
  const { strainId, breedingRecordId } = req.params;
  await BreedingRecord.findByIdAndUpdate(
    breedingRecordId,
    req.body.breedingRecord
  );
  res
    .status(200)
    .json({ message: "成功修改繁殖紀錄", redirect: `/strains/${strainId}` });
};

module.exports.deleteBreedingRecord = async (req, res) => {
  const { strainId, breedingRecordId } = req.params;
  await BreedingRecord.findByIdAndDelete(breedingRecordId);
  await Strain.findByIdAndUpdate(strainId, {
    $pull: { breedingRecords: breedingRecordId },
  });
  res
    .status(200)
    .json({ message: "成功刪除繁殖紀錄", redirect: `/strains/${strainId}` });
};
