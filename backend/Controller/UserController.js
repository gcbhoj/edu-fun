const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Utils/sendEmail");
const { generateUniqueId } = require("../Utils/UniqueIdGenerator");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: "failure", message: "All Fields are Required" });
    }

    const formattedName = name.trim().toLowerCase();
    const existingUserName = await userModel.findOne({ name: formattedName });
    if (existingUserName) {
      return res.status(409).json({ status: "failure", message: "User Name Already Taken." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ status: "failure", message: "Invalid Email Format." });
    }

    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ status: "failure", message: "Email Already Exists." });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        status: "failure",
        message: "Password must include uppercase, lowercase, number, and special character.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserId = generateUniqueId("u");

    const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const verificationLink = `${process.env.BASE_URL}/api/user/verify-email?token=${emailToken}`;

    const newUser = new userModel({
      _id: newUserId,
      name: formattedName,
      email,
      password: hashedPassword,
      emailToken,
    });

    await newUser.save();

    // Send verification email
    const html = `
      <h2>Email Verification</h2>
      <p>Hello ${name},</p>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `;
    await sendEmail(email, "Verify Your Email", html);

    res.status(201).json({
      status: "success",
      message: `User ${name} registered successfully. Verification email sent.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: `Unable to register User: ${error.message}`,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ status: "failure", message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email, emailToken: token });

    if (!user) {
      return res.status(400).json({ status: "failure", message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.emailToken = null;
    await user.save();

    // Send welcome email
    const html = `
      <h2>Welcome to MyApp!</h2>
      <p>Hi ${user.name},</p>
      <p>Your email has been successfully verified. Enjoy using the app!</p>
    `;
    await sendEmail(user.email, "Welcome to MyApp", html);

    res.status(200).json({ status: "success", message: "Email verified. Welcome email sent." });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: `Email verification failed: ${error.message}`,
    });
  }
};

module.exports = { registerUser, verifyEmail };
