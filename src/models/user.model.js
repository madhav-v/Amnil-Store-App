const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  location: {
    type: { type: String },
    coordinates: [],
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
