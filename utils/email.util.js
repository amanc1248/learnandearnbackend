const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
const http = require("http");
dotenv.config();

// send email
const sendEmail = async ({ email, subject, emailText }) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: emailText,
    };

    const info = await transporter.sendMail(mailOptions);
    if (info) {
      console.log("Email sent: " + info.response);
      return "success";
    }
  } catch (error) {
    // res.status(500).send("Internal Server Error");
    console.log("erro: ",error)
    throw new Error(error);
  }
};

// generate otp
const generateOTP = () => {
  return new Promise((resolve, reject) => {
    const digits = "1123456789";
    const otpLength = 6;
    const buffer = crypto.randomBytes(otpLength);
    let OTP = "";
    for (let i = 0; i < otpLength; i++) {
      OTP += digits[buffer.readUInt8(i) % 10];
    }
    let expiryDate;
    const options = {
      hostname: "worldtimeapi.org",
      path: "/api/timezone/Etc/UTC",
      method: "GET",
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        expiryDate = new Date(JSON.parse(data).utc_datetime);
        expiryDate.setMinutes(expiryDate.getMinutes() + 5);
        resolve({ OTP, expiryDate });
      });
    });

    req.on("error", (error) => {
      console.error("Error retrieving UTC time:", error);
      reject(error);
    });

    req.end();
  });
};
module.exports = {
  sendEmail,
  generateOTP,
};
