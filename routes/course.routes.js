const express = require("express");
const { createCourse, getCourse } = require("../controllers/course.controller");
const router = express.Router();
router.post("/", createCourse);
router.get("/", getCourse)
module.exports = router;