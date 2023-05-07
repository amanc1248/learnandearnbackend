const express = require("express");
const multer = require('multer');

const { uploadImageMiddleware } = require("../middlewares/image.middlewares");
const { waitFunction } = require("../utils/test.util");
const { checkSubscription } = require("../controllers/subscription.controller");
const { createPayment, getPaymentByUserIdReviewStatus, getAllPaymentsOfTheUser } = require("../controllers/payment.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// for creating payment when user is submitting payment request
router.post("/",waitFunction, checkSubscription, upload.single('paymentImage'),uploadImageMiddleware, createPayment);
// fetching payment of a user
router.get("/user", getPaymentByUserIdReviewStatus)
router.get("/all", getAllPaymentsOfTheUser)

// admin routes
module.exports = router;
