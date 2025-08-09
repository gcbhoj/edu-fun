const express = require("express");
const router = express.Router();

const {
  registerUser,
  forgotPassword,
  loginUser,
} = require("../Controller/UserController");

router.post("/register", registerUser);
router.post("/forgotPassword", forgotPassword);
router.post("/login", loginUser);

module.exports = router;
