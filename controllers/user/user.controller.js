const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { findUserByEmail, saveUser } = require("./user.subController");
const { validatePassword } = require("../../utils/password.util");
const { generateJwt } = require("../../utils/jwt.util");

const createUser = async(req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Generate a salt
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    // Hash the password with the salt
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await saveUser({name, email, password: hashedPassword});
    if(createdUser){
      console.log("User created");
     return res.status(201).send("success");
    }
  } catch (error) {
    res.status(500).send("error creating user");
  }
};

// get user
const checkUserIfExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail({email});
    if (user) {
      res.status(409).send("User already exists with this email address");
    } else {
      next();
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// user login
const userLogin = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await findUserByEmail({email});
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
};

// check if user password is valid
const validateUserPassword = async (req, res, next) => {
  try {
    const { password: hashedPassword } = req.user;
    const { password } = req.query;
    const isPasswordValid = await validatePassword({password, hashedPassword});
    if (isPasswordValid) {
      next();
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
};

// generate jwt token
const generateJwtToken = async (req, res, next) => {
  try {
    const { email } = req.query;
    const expiresIn = "1h";
    const jwt = await generateJwt({email, expiresIn});
    if(jwt){
      res.status(200).send(jwt);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// check if user exists before sending otp
const checkIfuserExistsBeforeSendingOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail({email});
    if (user) {
      res.status(409).send("User already exists. Please login.");
    } else {
      next();
    }
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
};

// check if user exists or not before sending otp for resetting password
const checkIfUserExistsForResetingPassword = async(req, res, next)=>{
  try {
    const { email } = req.body;
    const user = await findUserByEmail({email});
    if (user) {
      next();
    } else {
      res.status(409).send("User does not exist with that email address");
    }
  } catch (error) {
    res.status(400).send(error);
  }
}
module.exports = {
  createUser,
  checkUserIfExists,
  userLogin,
  validateUserPassword,
  generateJwtToken,
  checkIfuserExistsBeforeSendingOTP,
  checkIfUserExistsForResetingPassword,
};
