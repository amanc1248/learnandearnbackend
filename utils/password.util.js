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

module.exports = {
  validatePassword,
};
