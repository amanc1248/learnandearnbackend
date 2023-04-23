const express = require("express");
const multer = require('multer');

const { createPayment, getPaymentByUserIdReviewStatus, getAllPayments } = require("../controllers/payment/payment.controller");
const { checkSubscription } = require("../controllers/subscription/subscription.controller");
const { uploadImageMiddleware } = require("../middlewares/image.middlewares");

const upload = multer({ dest:"/uploads" });
const router = express.Router();

// for creating payment when user is submitting payment request
router.post("/",checkSubscription, upload.single('paymentImage'),uploadImageMiddleware, createPayment);

// fetching payment of a user
router.get("/user", getPaymentByUserIdReviewStatus)
router.get("/all", getAllPayments)
module.exports = router;
