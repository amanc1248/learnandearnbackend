const express = require("express");
const { sendOTP, saveOTP, getOTP, verifyOTP } = require("../controllers/otp/otp.controller");
const { checkIfuserExistsBeforeSendingOTP, checkIfUserExistsForResetingPassword } = require("../controllers/user/user.controller");
const router = express.Router();

router
  .post("/creatUserOTP", checkIfuserExistsBeforeSendingOTP, sendOTP, saveOTP)
  .get("/", getOTP, verifyOTP)
  .post("/resetPasswordOTP",checkIfUserExistsForResetingPassword, sendOTP, saveOTP)
module.exports = router;
