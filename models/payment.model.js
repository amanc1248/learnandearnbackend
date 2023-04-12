const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    paymentImage: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      optional: true,
    },
    walletName: {
      type: String,
      optional: true,
    },
    bankAccountNumber: {
      type: String,
      optional: true,
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    transactionId: {
      type: String,
      required: true,
    },
    reviewStatus:{
      type: String,
      required: true,
      default:"inReview"
    },
    paymentDate:{
      type: Date,
      required: true,
    },
    additionalInformation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
