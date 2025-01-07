const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StrainSchema = new Schema({
  strain: String,
  abbr: String,
  iacuc_no: String,
  dept: String,
  EXP: Date,
  users: [
    {
      type: String,
    },
  ],
  genes: [
    {
      type: String,
    },
  ],
  mice: [
    {
      type: Schema.Types.ObjectId,
      ref: "Mouse",
    },
  ],
  breedingRecords: [
    {
      type: Schema.Types.ObjectId,
      ref: "BreedingRecord",
    },
  ],
});

StrainSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Mouse = require("./mouse");
    const BreedingRecord = require("./breedingRecord");
    await Mouse.deleteMany({
      _id: {
        $in: doc.mice,
      },
    });

    await BreedingRecord.deleteMany({
      _id: {
        $in: doc.breedingRecords,
      },
    });
    console.log("check");
  }
});

module.exports = mongoose.model("Strain", StrainSchema);
