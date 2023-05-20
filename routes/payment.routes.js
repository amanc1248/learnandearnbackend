const express = require("express");
const multer = require("multer");

const { uploadImageMiddleware } = require("../middlewares/image.middlewares");
const { waitFunction } = require("../utils/test.util");
const { checkSubscription } = require("../controllers/subscription.controller");
const {
  createPayment,
  getPaymentStatus,
  getAllPaymentsOfTheUser,
  sendEmailAfterCreatingPayment,
} = require("../controllers/payment.controller");
const { updateIsUpgradeable } = require("../controllers/user.controller");
const { sendEmail } = require("../utils/email.util");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// for creating payment when user is submitting payment request
router.post(
  "/",
  waitFunction,
  checkSubscription,
  upload.single("paymentImage"),
  uploadImageMiddleware,
  createPayment,
  sendEmailAfterCreatingPayment,
);
// fetching payment of a user
router.get("/user", getPaymentStatus);
router.get("/all", getAllPaymentsOfTheUser);

// admin routes
module.exports = router;
