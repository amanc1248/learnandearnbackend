const express = require("express");
const { createPayment } = require("../controllers/payment/payment.controller");
const { checkSubscription } = require("../controllers/subscription/subscription.controller");
const { upload } = require("../middlewares/image.middlewares");
const router = express.Router();

router.post("/", checkSubscription,upload.single('file'), createPayment)
module.exports = router;
