const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { generateUniqueId } = require("../Utils/UniqueIdGenerator");

const registerUser = async (req, res) => {
  try {
    //parsing userdata from request
    const { name, email, password } = req.body;
    // checking for null values
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: "failure", message: "All Fields are Required" });
    }
    // normalizing name to lowercase and checking for username availability
    const formattedName = name.trim().toLowerCase();

    const verifyUserName = await userModel.findOne({ name: formattedName });
    if (verifyUserName) {
      return res
        .status(409)
        .json({ status: "failure", message: "User Name Already Taken." });
    }

    /*using validator to check the email format is correct or not
      NOTE: Validator only checks for email format not validity of the email
    */

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ status: "failure", message: "Email Format Not Valid." });
    }

    let verifyUserEmail = await userModel.findOne({ email: email });
    if (verifyUserEmail) {
      return res.status(409).json({
        status: "failure",
        message: "User with the given email already exists.",
      });
    }
    /* using validtor of check the strength of the password and its compliance*/

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        status: "failure",
        message:
          "Password must be strong (include uppercase, lowercase, number, and special character).",
      });
    }

    const salt = await bcrypt.genSalt(10); // generating salt to add to hashed password
    const hashedPassword = await bcrypt.hash(password, salt); // using bcrypt to hash the password and salting
    const newUserId = generateUniqueId("u"); // generating a unique id that is divided into  date, time and a rondom 4 digit number.

    //Inserting the data into the user Model.
    const newUser = new userModel({
      _id: newUserId,
      name: formattedName,
      email,
      password: hashedPassword,
    });
    // saving the user data to database.
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
