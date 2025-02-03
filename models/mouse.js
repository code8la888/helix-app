const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MouseSchema = new Schema({
  no: String,
  strain: {
    type: Schema.Types.ObjectId,
    ref: "Strain",
  },
  toeNumber: String,
  birth_date: Date,
  gender: {
    type: String,
    enum: ["F", "M"],
  },
  parents: {
    father: {
      type: String,
    },
    mother: {
      type: String,
    },
  },
  sampling_date: Date,
  sampling_results: [
    {
      type: String,
      enum: ["WT", "HT", "KO", "檢測中"],
    },
  ],
  litter: Number,
  on_shelf: { type: String, enum: ["在架上", "已移出", "已犧牲", "自然死亡"] },
  note: String,
});

module.exports = mongoose.model("Mouse", MouseSchema);
