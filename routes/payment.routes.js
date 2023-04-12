const express = require("express");
const { createPayment } = require("../controllers/payment/payment.controller");
const { checkSubscription } = require("../controllers/subscription/subscription.controller");
const router = express.Router();

router.post("/", checkSubscription, createPayment)
module.exports = router;
