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

module.exports = mongoose.model("Strain", StrainSchema);
