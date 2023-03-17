const OTP = require("../../models/otp.model");
const { sendEmail } = require("../../utils/email.util");
const dotenv = require('dotenv');
dotenv.config();

// sending otp
const sendOTP = async (req,res,next) => {
  try {
    const {email} = req.body;
    const otp = await sendEmail({email});
    if(otp){
      req.otp = otp;
      next()
    }
  } catch (err) {
    res.status(500).send({message:"internal server error"});
  }
};

// saving otp
const saveOTP = (req,res,next) => {
  try {
    const {otp} = req;
    const newOTP = new OTP(otp);
    newOTP
      .save()
      .then(() => {
        console.log("OTP saved successfully");
        res.send("success")
      })
      .catch((error) => {
        console.log(error);
        res.status(500)
      });
  } catch (error) {}
};

// get otp
const getOTP = async(req,res,next)=>{
  try{
    const {otp, email} = req.query;
    const result = await OTP.findOne({OTP:otp, email},{OTP:1,email:1,expiryDate:1}).lean();
    if(result){
      req.otp = result;
      next()
    }else{
      res.status(400).send("Invalid OTP")
    }
  }catch(error){
    console.error(error);
  }
}

// verify OTP
const verifyOTP = (req,res)=>{
  try{
    const {expiryDate} = req.otp;
    const valid =Math.abs(expiryDate - new Date())< process.env.EXPIRY_MINUTES *60 *1000;
    if(valid){
      res.status(200).send("valid");
    }else{
      res.status(400).send("OTP Expired")
    }
  }catch(error){
    console.log(error);
  }
}
module.exports = {
  sendOTP,
  saveOTP,
  getOTP,
  verifyOTP,
};
