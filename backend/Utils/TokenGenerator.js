const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Creates a JWT token and a hashed token.
 *
 * @param {string} _id - The user's ID
 * @param {string} expiry - Token expiration time (e.g., "1h", "7d")
 * @returns {{ jwtToken: string, hashedAccessToken: string,accessToken:string }} - Object with all tokens ready to be used according to scenarios.
 */
const createToken = (_id, expiry) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  // Generate a secure random token (useful for password reset, email verification, etc.)
  const accessToken = crypto.randomBytes(32).toString("hex");
  // Hasing the  above generated access token (useful to store it in the database for validation purposes)
  const hashedAccessToken = crypto
    .createHash("sha256")
    .update(accessToken)
    .digest("hex");

  // Create a JWT token containing the user ID
  const jwtToken = jwt.sign({ _id }, jwtkey, { expiresIn: expiry });

  // Return both
  return { jwtToken, hashedAccessToken, accessToken };
};

module.exports = { createToken };
