const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 200,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 1024,
    },
    age: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
