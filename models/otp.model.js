const mongoose = require('mongoose');

const OTPSchema =  new mongoose.Schema({
    OTP:{
        type: Number,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    expiryDate:{
        type: Date,
        required: true,
    },
    valid:{
        type: Boolean,
        required: true,
        default:true
    }
},{timestamps:true});

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;