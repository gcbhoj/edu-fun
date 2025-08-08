const express = require("express");
const router = express.Router();

const {
  registerUser,
  forgotPassword,
} = require("../Controller/UserController");

router.post("/register", registerUser);
router.post("/forgotPassword", forgotPassword);

module.exports = router;
