const express = require("express");
const { getSinglePayment, getAllPayments, updatePaymentById } = require("../controllers/payment.controller");
const { getFullDetailsOfUser, adminGetAllUsers } = require("../controllers/user.controller");
const { getSubscriptionById } = require("../controllers/subscription.controller");

const router = express.Router();

router.get("/payment", getSinglePayment)
router.get("/user/fullDetails", getFullDetailsOfUser);
router.get("/subscription", getSubscriptionById)
router.get("/payment/all", getAllPayments);
router.get("/user/all", adminGetAllUsers);
router.put("/payment/", updatePaymentById)

module.exports = router;
