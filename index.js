const express = require("express");
const app = express();
const dotenv = require("dotenv");
const database = require("./database/database");
const userRouter = require("./routes/user.route.js")
const otpRouter = require("./routes/otp.route.js")
const bodyParser = require("body-parser");
const cors = require("cors");
dotenv.config();

const port = process.env.PORT || 8081;

app.use(bodyParser.json())
app.use(cors());
// user routes
app.use("/user",userRouter)

// otp routes
app.use("/otp",otpRouter)
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});