const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dept: String,
  tel: String,
  role: {
    type: String,
    enum: ["計畫管理人", "委託人", "獸醫"],
  },
  googleId: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
