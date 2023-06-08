const express = require("express");
const { createCourse, getCourse, createEntireCourse } = require("../controllers/course.controller");
const router = express.Router();
router.post("/", createCourse);
router.get("/", getCourse)
router.post("/createEntireCourse",createEntireCourse);
module.exports = router;