const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const createUser = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Generate a salt
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    // Hash the password with the salt
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      salt,
    });

    // save the user to the database
    newUser
      .save()
      .then(() => {
        res.status(201).send("success");
        console.log("User created");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("error creating user");
      });
  } catch (error) {
    res.status(500).send("error creating user");
  }
};

// get user
const checkUserIfExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).lean();
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
    const user = await User.findOne(
      { email },
      { email: 1, password: 1, salt: 1 }
    ).lean();
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).status(error);
  }
};

// check if user is valid
const validateUserPassword = async (req, res, next) => {
  try {
    const { password: hashedPassword } = req.user;
    const { password } = req.query;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (isPasswordValid) {
      next();
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    res.status(400).status(error);
  }
};

// generate jwt token
const generateJwtToken = async (req, res, next) => {
  try {
    const { email } = req.query;
    const secretKey = process.env.JWT_SECRET_KEY;
    const payload = {
        email
    };
    const options = {
      expiresIn: "1h", // Set the token to expire in 1 hour
    };
    const token = jwt.sign(payload, secretKey, options);
    res.status(200).send(token);
  } catch (error) {
    console.error(error);
    res.status(400).status(error);
  }
};
module.exports = {
  createUser,
  checkUserIfExists,
  userLogin,
  validateUserPassword,
  generateJwtToken,
};
