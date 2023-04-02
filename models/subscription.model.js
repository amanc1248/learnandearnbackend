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
    susbcriptionType: {
        type: String,
        required: true,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
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