const {
  findUserByEmail,
  saveUser,
  updateUserPassword,
  updateUserEmail,
} = require("./user.subController");
const {
  validatePassword,
  generateHashedPassword,
} = require("../../utils/password.util");
const { generateJwt } = require("../../utils/jwt.util");
const { sendEmail } = require("../../utils/email.util");

// create user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await generateHashedPassword({ password });
    const createdUser = await saveUser({
      name,
      email,
      password: hashedPassword,
    });
    if (createdUser) {
      req.sendSlackInvitationDetails= {name, email};
      next();
    }
  } catch (error) {
    res.status(500).send("error creating user");
  }
};

// send email for slack invitation after creating user
const sendSlackInvitationEmail = async(req,res,next)=>{
  try{
    const {name, email} = req.sendSlackInvitationDetails
    const sentEmail = await sendEmail({email, subject:"Slack Invitation", emailText:`Hello ${name}! You are invited to join our slack channel`});
    if (sentEmail){
      return res.status(200).send("success");
    }
  }catch(error){
    res.status(500).send("error creating user");
  }
}
// get user
const checkUserIfExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail({ email });
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
    const user = await findUserByEmail({ email });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// check if user password is valid
const validateUserPassword = async (req, res, next) => {
  try {
    const { password: hashedPassword } = req.user;
    const { password } = req.query;
    const isPasswordValid = await validatePassword({
      password,
      hashedPassword,
    });
    if (isPasswordValid) {
      next();
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// generate jwt token
const generateJwtToken = async (req, res, next) => {
  try {
    const { email } = req.query;
    const expiresIn = "1h";
    const jwt = await generateJwt({ email, expiresIn });
    if (jwt) {
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
    const user = await findUserByEmail({ email });
    if (user) {
      res.status(409).send("User already exists. Please login.");
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// check if user exists or not before sending otp for resetting password
const checkIfUserExistsForResetingPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail({ email });
    if (user) {
      next();
    } else {
      res.status(409).send("User does not exist with that email address");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// reset user password
const resetUserPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await generateHashedPassword({ password });
    const result = await updateUserPassword({
      email,
      password: hashedPassword,
    });
    if (result) return res.status(200).send("success");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// send user details
const sendUserDetails = async (req, res, next) => {
  try {
    const { user } = req;
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// udpate user emial
const udpateUserEmail = async (req, res, next) => {
  try {
    const { id, email, newEmail } = req.body;
    const updatedUser = await updateUserEmail({ id, oldEmail:email, newEmail });
    if (updatedUser){
      req.updatedUser = updatedUser;
      next();
    };
    return null;
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// generate jwt when change email
const generateJWTWhenChangedEmail = async(req, res, next)=>{
  try{
    const updatedUser = req.updatedUser;
    const {email} = updatedUser;
    const expiresIn = "1h";
    const jwt = await generateJwt({ email, expiresIn });
    if (jwt) {
      res.status(200).send({jwt, updatedUser});
    }
  }catch(error){
    console.error(error);
    res.status(400).send(error);
  }
}

// change user password
const changeUserPassword =async(req,res,next)=>{
  try{
    const {email, newPassword, currentPassword} = req.body;
    const user = await findUserByEmail({email});
    if(!user) return res.status(400).send("user not found");
    const isPasswordValid = await validatePassword({password: currentPassword, hashedPassword: user.password});
    if(!isPasswordValid) return res.status(400).send("Current password is incorrect");
    const updatedUserPassword = await updateUserPassword({email, password: newPassword});
    if(!updatedUserPassword) return res.status(400).send("Something went wrong updating the password");
    return res.status(201).send("success");
  }catch(e){
    return res.status(400).send(e);
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
  resetUserPassword,
  sendUserDetails,
  udpateUserEmail,
  generateJWTWhenChangedEmail,
  changeUserPassword,
  sendSlackInvitationEmail,
};
