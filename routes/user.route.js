const express = require('express');
const { createUser, checkUserIfExists } = require('../controllers/user/user.controller');
const { sendEmail } = require('../utils/email.util');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send("Hii some")
}).post('/', checkUserIfExists, createUser)
router.post('/sendEmail',sendEmail)
module.exports = router;