const express = require("express");
const {
  createUser,
  checkUserIfExists,
  userLogin,
  validateUserPassword,
  generateJwtToken,
  checkIfUserExistsForResetingPassword,
  changeUserPassword,
  sendUserDetails,
} = require("../controllers/user/user.controller");
const { authenticateToken } = require("../middlewares/auth.middlewares");
const { sendEmail } = require("../utils/email.util");
const router = express.Router();

// creating user
router.post("/", checkUserIfExists, createUser);


router.post("/sendEmail", sendEmail);
router.get("/login", userLogin, validateUserPassword, generateJwtToken);
router.put("/resetPassword",checkIfUserExistsForResetingPassword,changeUserPassword);
router.get("/checkLogin", authenticateToken, sendUserDetails);
module.exports = router;
