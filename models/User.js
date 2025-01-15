const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dept: String,
  tel: String,
  role: {
    type: String,
    enum: ["計畫主持人", "學生", "研究助理", "品系管理人", "獸醫"],
  },
  googleId: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.models.users || mongoose.model("users", UserSchema);
