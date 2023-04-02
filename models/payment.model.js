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
    status: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
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
