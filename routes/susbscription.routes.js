const express = require("express");
const { getAllActiveSubscriptionOfTheUser } = require("../controllers/subscription/subscription.controller");
const router = express.Router();

router.get("/user",getAllActiveSubscriptionOfTheUser);
module.exports = router;