const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: { type: String, required: true, minLength: 3, maxLength: 200 },
    password: { type: String, required: true, minLength: 3, maxLength: 1024 },
    isVerified: { type: Boolean, default: false },
    emailToken: { type: String },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
