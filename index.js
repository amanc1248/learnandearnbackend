const express = require("express");
const app = express();
const dotenv = require("dotenv");
const database = require("./database/database");
const userRouter = require("./routes/user.routes.js")
const otpRouter = require("./routes/otp.routes.js")
const paymentRouter = require("./routes/payment.routes.js")
const bodyParser = require("body-parser");
const cors = require("cors");
const { authenticateToken } = require("./middlewares/auth.middlewares");
dotenv.config();

const port = process.env.PORT || 8082;

app.use(bodyParser.json())
app.use(cors());
// user routes
app.use("/user",userRouter)

// otp routes
app.use("/otp",otpRouter)

app.use("/payment",authenticateToken, paymentRouter)
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});