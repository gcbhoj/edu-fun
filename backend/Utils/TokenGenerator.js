const jwt = require("jsonwebtoken");
const createToken = (_id, expiry) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: expiry });
};

module.exports = { createToken };
