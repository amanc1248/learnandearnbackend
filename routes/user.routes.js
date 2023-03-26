const express = require("express");
const {
  createUser,
  checkUserIfExists,
  userLogin,
  validateUserPassword,
  generateJwtToken,
  checkIfUserExistsForResetingPassword,
  resetUserPassword,
  sendUserDetails,
  udpateUserEmail,
  generateJWTWhenChangedEmail,
  changeUserPassword,
} = require("../controllers/user/user.controller");
const { authenticateToken } = require("../middlewares/auth.middlewares");
const { sendEmail } = require("../utils/email.util");
const router = express.Router();

// creating user
router.post("/", checkUserIfExists, createUser);


router.post("/sendEmail", sendEmail);
router.get("/login", userLogin, validateUserPassword, generateJwtToken);
router.put("/resetPassword",checkIfUserExistsForResetingPassword,resetUserPassword);
router.get("/checkLogin", authenticateToken, sendUserDetails);
router.put("/changeEmail", authenticateToken, udpateUserEmail, generateJWTWhenChangedEmail);
router.put("/changePassword", authenticateToken, changeUserPassword)
module.exports = router;
