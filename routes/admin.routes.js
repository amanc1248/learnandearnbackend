const express = require("express");
const { getSinglePayment } = require("../controllers/payment.controller");
const { getFullDetailsOfUser } = require("../controllers/user.controller");
const { getSubscriptionById } = require("../controllers/subscription.controller");

const router = express.Router();

router.get("/payment", getSinglePayment)
router.get("/user/fullDetails", getFullDetailsOfUser);
router.get("/subscription", getSubscriptionById)

module.exports = router;
