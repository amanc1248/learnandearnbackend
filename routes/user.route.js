const express = require("express");
const {
  createUser,
  checkUserIfExists,
  userLogin,
  validateUserPassword,
  generateJwtToken,
} = require("../controllers/user/user.controller");
const { authenticateToken } = require("../middlewares/auth.middlewares");
const { sendEmail } = require("../utils/email.util");
const router = express.Router();

router
  .get("/", (req, res) => {
    res.send("Hii some");
  })
  .post("/", checkUserIfExists, createUser);
router.post("/sendEmail", sendEmail);
router.get("/login", userLogin, validateUserPassword, generateJwtToken);
router.get("/test", authenticateToken, (req, res, next) => {
  res.send("test success");
});
module.exports = router;
