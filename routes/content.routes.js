const express = require("express");
const { createContent } = require("../controllers/content.controller");
const router = express.Router();
router.post("/", createContent)
module.exports = router;