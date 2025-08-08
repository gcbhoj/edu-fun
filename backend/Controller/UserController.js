const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { calculateAge } = require("../Utils/AgeCalulator");

const { generateUniqueId } = require("../Utils/UniqueIdGenerator");
/**
 * The below block of code gets the user information from  front end validates and stores securely to the database.
 * @param {name:string} req.body  // name of the user being extracted from request's body
 * @param {email:string} req.body // email address of the user  from request's body
 * @param{password:sting} req.body // raw password the user choose
 * @param{dateOfBirth:Date} req.body // date of birth of the user for age calcuation
 * @returns response status
 * - status code 201 - user registered sucessfully
 * - status code 400 - Bad request (missing information, data validation failed)
 * - status code 500 - Server Error
 */

const registerUser = async (req, res) => {
  try {
    //parsing userdata from request
    const { name, email, password, dateOfBirth } = req.body;
    // checking for null values
    if (!name || !email || !password || !dateOfBirth) {
      return res.status(400).json({
        status: "failure",
        message: "All Fields are Required",
        details: "Fill in all the fields",
      });
    }
    // normalizing name to lowercase and checking for username availability
    const formattedName = name.trim().toLowerCase();

    const verifyUserName = await userModel.findOne({ name: formattedName });
    if (verifyUserName) {
      return res.status(409).json({
        status: "failure",
        message: "User Name Already Taken.",
        details: `Sorry!\nthe name you chose is already taken.`,
      });
    }

    /*using validator to check the email format is correct or not
      NOTE: Validator only checks for email format not validity of the email
    */

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "failure",
        message: "Email Format Not Valid.",
        details: "Enter a Valid Email Address.",
      });
    }

    let verifyUserEmail = await userModel.findOne({ email: email });
    if (verifyUserEmail) {
      return res.status(409).json({
        status: "failure",
        message: "User with the given email already exists.",
        details: `user already exists\ntry resetting your password.`,
      });
    }
    /* using validtor of check the strength of the password and its compliance*/

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        status: "failure",
        message: "given password does not meet criteria.",
        details:
          "Password must be strong (include uppercase, lowercase, number, and special character).",
      });
    }

    const calculatedAge = calculateAge(dateOfBirth);

    if (calculatedAge < 0 || calculatedAge > 100) {
      return res.status(400).json({
        status: "failure",
        message: "Invalid Age",
        details: "Age cannot be less than 0 or greter than 100",
      });
    }

    const salt = await bcrypt.genSalt(10); // generating salt to add to hashed password
    const hashedPassword = await bcrypt.hash(password, salt); // using bcrypt to hash the password and salting
    const newUserId = generateUniqueId("u"); // generating a unique id that is divided into  date, time and a rondom 4 digit number.

    //Inserting the data into the user Model.
    const newUser = new userModel({
      _id: newUserId,
      name: formattedName,
      dateOfBirth,
      email,
      password: hashedPassword,
      age: calculatedAge,
    });
    // saving the user data to database.
    const response = await newUser.save();

    if (!response) {
      return res.status(400).json({
        status: "failure",
        message: `Could Not Complete your request.\n
        Please try again Later.`,
        details: "Possibility of validation issue or database problem.",
      });
    }
    res.status(201).json({
      status: "success",
      message: "New User Added Sucessfully",
      details: `Welcome ${name} to our Applicaton.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: "Unable to register User",
      details: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server Error",
      details: error.message,
    });
  }
};

module.exports = { registerUser };
