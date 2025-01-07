const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Mice = require("./mouse");

const BreedingRecordSchema = new Schema({
  strain: {
    type: Schema.Types.ObjectId,
    ref: "Strain",
  },
  cage_no: String,
  parents: {
    father: {
      type: String,
    },
    mother: {
      type: String,
    },
  },
  pairing_date: Date,
  offspring: {
    type: Schema.Types.ObjectId,
    ref: Mice,
  },
  on_shelf: {
    type: String,
    enum: ["在架上", "已關閉"],
  },
});

module.exports = new mongoose.model("BreedingRecord", BreedingRecordSchema);
