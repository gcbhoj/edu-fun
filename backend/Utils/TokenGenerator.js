const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Creates a JWT token and tokens that are required for authentication purposes.
 *
 * @param {string} _id - The user's ID
 * @param {string} expiry - Token expiration time (e.g., "1h", "7d")
 * @returns {{ jwtToken: string, hashedAccessToken: string,accessToken:string, accessTokenExpiry:Date&Time }} - Object with all tokens ready to be used according to scenarios.
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
  
  
  //generating a token expirty time with a standard time of 15 min can be used for reseting passwords
  const accessTokenExpiry = new Date(
    Date.now() + process.env.PASSWORD_RESET_TIME * 60 * 1000
  ).toISOString();

  // Create a JWT token containing the user ID
  const jwtToken = jwt.sign({ _id }, jwtkey, { expiresIn: expiry });

  // Return all tokens
  return { jwtToken, hashedAccessToken, accessToken, accessTokenExpiry };
};

module.exports = { createToken };
