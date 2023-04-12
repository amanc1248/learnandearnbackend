const PaymentModel = require("../../models/payment.model");
const paymentSubController = {
  // save payment
  save: async ({ paymentObject }) => {
    try {
      const newPayment = new PaymentModel(paymentObject);
      const createdPayment = await newPayment.save();
      if (!createdPayment) return null;
      console.log("Payment saved successfully");
      return createdPayment;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
module.exports = {
  paymentSubController,
};
