const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRouter = require("./routes/user.routes.js")
const otpRouter = require("./routes/otp.routes.js")
const paymentRouter = require("./routes/payment.routes.js");
const subscriptionRouter =require("./routes/susbscription.routes");
const adminRouter = require("./routes/admin.routes.js");
const courseRouter = require("./routes/course.routes.js");
const moduleRouter = require("./routes/module.routes.js");
const contentRouter = require("./routes/content.routes.js");
const bodyParser = require("body-parser");
const database = require("./database/database");
const cors = require("cors");
const { authenticateToken, authenticateAdminToken } = require("./middlewares/auth.middlewares");
dotenv.config();

const port = process.env.PORT || 8082;

app.use(bodyParser.json())
app.use(cors());
app.use("/user",userRouter)
app.use("/otp",otpRouter)
app.use("/payment",authenticateToken, paymentRouter);
app.use("/subscription",authenticateToken,subscriptionRouter);
app.use("/admin", authenticateAdminToken, adminRouter);
app.use("/course",authenticateToken, courseRouter);
app.use("/module",authenticateToken, moduleRouter);
app.use("/content",authenticateToken, contentRouter);
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});