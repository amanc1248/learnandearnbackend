const bcrypt = require("bcrypt");

// validate password
const validatePassword = async ({ password, hashedPassword }) => {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    throw new Error(error);
  }
};

// generate hashed password
const generateHashedPassword = async ({ password }) => {
  try {
    // Generate a salt
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    // Hash the password with the salt
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
module.exports = {
  validatePassword,
  generateHashedPassword,
};
