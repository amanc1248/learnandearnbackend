const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    subscriptionStartDate:{
        type: Date,
        required: true,
    },
    subscriptionEndDate:{
        type: Date,
        required: true,
    },
    subscriptionAmount: {
        type: Number,
        required: true,
    },
    subscriptionType: {
        type: String,
        required: true,
    },
    isSubscriptionActive: {
        type: Boolean,
        required: true,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        optional: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},{
    timestamps:true
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
module.exports = Subscription;