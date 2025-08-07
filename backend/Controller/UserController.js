const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { generateUniqueId } = require("../Utils/UniqueIdGenerator");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: "failure", message: "All Fields are Required" });
    }

    const formattedName = name.trim().toLowerCase();

    const verifyUserName = await userModel.findOne({ name: formattedName });
    if (verifyUserName) {
      return res
        .status(409)
        .json({ status: "failure", message: "User Name Already Taken." });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ status: "failure", message: "Email Format Not Valid." });
    }

    let verifyUserEmail = await userModel.findOne({email: email });
    if (verifyUserEmail) {
      return res.status(409).json({
        status: "failure",
        message: "User with the given email already exists.",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        status: "failure",
        message:
          "Password must be strong (include uppercase, lowercase, number, and special character).",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserId = generateUniqueId("u");

    const newUser = new userModel({
      _id: newUserId,
      name: formattedName,
      email,
      password: hashedPassword,
    });
    const response = await newUser.save();

    if (!response) {
      return res.status(400).json({
        status: "failure",
        message: "Could Not Complete your request. Please try again Later.",
      });
    }
    res.status(201).json({
      status: "success",
      message: `User ${name} created sucessfully. `,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: `Unable to register User: ${error.message}`,
    });
  }
};

module.exports = { registerUser };
