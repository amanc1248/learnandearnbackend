const express = require("express");
const { authenticateToken } = require("../middlewares/auth.middlewares");
const { checkIfuserExistsBeforeSendingOTP, checkIfUserExistsForResetingPassword } = require("../controllers/user.controller");
const { sendOTP, saveOTP, verifyOTP, getOTP } = require("../controllers/otp.controller");
const router = express.Router();

router
  .post("/creatUserOTP", checkIfuserExistsBeforeSendingOTP, sendOTP, saveOTP)
  .get("/", getOTP, verifyOTP)
  .post("/resetPasswordOTP",checkIfUserExistsForResetingPassword, sendOTP, saveOTP)
  .post("/changeEmailOTP", authenticateToken, sendOTP, saveOTP)
module.exports = router;
