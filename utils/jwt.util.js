const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// generate json web token
const generateJwt = async ({ email,expiresIn="1h" }) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const payload = {
      email,
    };
    const options = {
      expiresIn, // Set the token to expire in 1 hour
    };
    const token = jwt.sign(payload, secretKey, options);
    return token;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports ={
    generateJwt,
}