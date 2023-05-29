const express = require("express");
const { createModule } = require("../controllers/module.controller");
const router = express.Router();
router.post("/", createModule)
module.exports = router;