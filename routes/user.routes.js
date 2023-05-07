const express = require("express");

const { authenticateToken, authenticateAdminToken } = require("../middlewares/auth.middlewares");
const { sendEmail } = require("../utils/email.util");
const { waitFunction } = require("../utils/test.util");
const { checkUserIfExists, createUser, sendSlackInvitationEmail, userLogin, validateUserPassword, generateJwtToken, resetUserPassword, checkIfUserExistsForResetingPassword, sendUserDetails, udpateUserEmail, generateJWTWhenChangedEmail, changeUserPassword, adminLogin, getFullDetailsOfUser } = require("../controllers/user.controller");
const { createSubscriptionAfterCreatingUser } = require("../controllers/subscription.controller");
const router = express.Router();

// creating user
router.post("/",waitFunction, checkUserIfExists, createUser, createSubscriptionAfterCreatingUser, sendSlackInvitationEmail);

router.post("/sendEmail", sendEmail);
router.get("/login", waitFunction, userLogin, validateUserPassword, generateJwtToken);
router.put("/resetPassword",checkIfUserExistsForResetingPassword,resetUserPassword);
router.get("/checkLogin", authenticateToken, sendUserDetails);
router.put("/changeEmail", authenticateToken, udpateUserEmail, generateJWTWhenChangedEmail);
router.put("/changePassword", authenticateToken, changeUserPassword);

// admin routes
router.get("/adminLogin", waitFunction, adminLogin, generateJwtToken)
module.exports = router;
