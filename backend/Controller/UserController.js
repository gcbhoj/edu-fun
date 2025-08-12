const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { calculateAge } = require("../Utils/AgeCalulator");
const {
  jwtToken,
  hashedAccessToken,
  accessToken,
  accessTokenExpiry,
  createToken,
} = require("../Utils/TokenGenerator");
const { generateUniqueId } = require("../Utils/UniqueIdGenerator");
const sendEmail = require("../Services/Email");
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

const loginAttempts = {}; // { email: { count: 0, lockUntil: timestamp } }
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "failure",
        message: "Email Address Cannot be Empty",
        details: "Enter Your Email Address",
      });
    }

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        staus: "Not Found",
        message: "User Not Found",
        details: `The provided email address does not exist.\nPlease Enter a valid email address.`,
      });
    }

    const { _id, name } = user;
    const { hashedAccessToken, accessToken, accessTokenExpiry } = createToken(
      _id,
      "15min"
    );
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/resetPassword/${accessToken}`;

    const message = `dear ${name};\n we have received a password reset request for this email address.please use the below link to reset your password\n\n${resetUrl}.\n\nthe above link will expire in 15 min.\nhave a wonderful day\nour app\nsupport team. `;

    user.passwordResetToken = hashedAccessToken;
    user.passwordResetTokenExpiry = accessTokenExpiry;
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        Subject: "Password Reset Request",
        message: message,
      });
      return res.status(200).json({
        status: "success",
        message: "Email sent",
        details:
          "Email with Password Reset Link has been sent to your email address.",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
      await user.save();
      return res.status(500).json({
        status: "error",
        message: "Error Sending Email",
        details: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server Error",
      details: error.message,
    });
  }
};

const loginUser = async (req, res) => {

  try {
    // Extracting email and password from request body
    const { email, password } = req.body;
    const now = Date.now();

    // Validating email and password
    if (!email || !password) {
      return res.status(400).json({
        status: "failure",
        message: "Email and/or password missing",
        details: "Fill in all the details",
      });
    }

    // Checking if the email format is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "failure",
        message: "Email Format Not Valid.",
        details: "Enter a Valid Email Address.",
      });
    }

    // Finding the user by email
    let user = await userModel.findOne({ email: email });

    // If user does not exist, return an error
    if (!user) {
      return res.status(409).json({
        status: "failure",
        message: "User with the given email does not exists.",
        details: `user dosent exists\ntry registering or review you email.`,
      });
    }

    console.log(loginAttempts);

    // Checking if the user is active
    if (user.lockOutTimeExpiry && user.lockOutTimeExpiry > now) {
      return res.status(403).json({
        status: "failure",
        message: "Account is locked",
        details: `Your account is locked until ${user.lockOutTimeExpiry}. Please try again later.`,
      });
    }

    // Checking if the password is valid
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    // If password is invalid, handle login attempts
    if (!isPasswordValid) {

      if (!loginAttempts[email]) loginAttempts[email] = { count: 0, lockUntil: null };
      loginAttempts[email].count++;

      if (loginAttempts[email].count >= MAX_ATTEMPTS) {
        loginAttempts[email].lockUntil = now + LOCK_TIME;
        loginAttempts[email].count = 0;

        user.isActive = false; // Lock the user account
        user.lockOutTimeExpiry = new Date(loginAttempts[email].lockUntil);
        await user.save();

        return res.status(403).json({
          status: "faliure",
          message: "Too many failed attempts. Locked for 15 mins.",
          details: "You have exceeded the maximum number of login attempts. Please try again after 15 minutes."
        });
      }

      return res.status(401).json({
        status: "failure",
        message: "Invalid Password",
        details: "The password you entered is incorrect. You have " + (MAX_ATTEMPTS - loginAttempts[email].count) + " attempts left before your account is locked.",
      });
    } else {
      // Resetting lockout time if the password is valid
      if (loginAttempts[email]) {
        delete loginAttempts[email]
      }
      user.lockOutTimeExpiry = null; // Resetting lockout time
      if (!user.isActive) {
        user.isActive = true; // Ensuring user is active
      }
      await user.save();
    }

    // If everything is valid, create a JWT token
    const token = createToken(user._id, "30d");

    // Updating the user's last login time
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        token: token.jwtToken,
      },
    });

  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: "Unable to login User",
      details: error.message,
    });
  }
}

module.exports = { registerUser, forgotPassword, loginUser };
