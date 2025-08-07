const express = require("express");
const router = express.Router();

const { registerUser, verifyEmail } = require("../Controller/UserController");

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);

module.exports = router;
