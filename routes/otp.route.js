const express = require("express");
const { sendOTP, saveOTP, getOTP, verifyOTP } = require("../controllers/otp/otp.controller");
const router = express.Router();

router
  .post("/", sendOTP, saveOTP)
  .get("/", getOTP, verifyOTP);
module.exports = router;
