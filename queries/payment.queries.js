const PaymentModel = require("../models/payment.model");
const paymentQueries = {
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

  // findOne and review status
  findOne: async({criteria})=>{
    try{
      const payment = await PaymentModel.findOne(criteria).lean();
      return payment;
    }catch(e){
      console.log(e)
      throw new Error(e)
    }
  },

  // find
  find: async({criteria})=>{
    try{
      const payment = await PaymentModel.find(criteria).lean();
      return payment;
    }catch(e){
      console.error(e);
      throw new Error(e);
    }
  },

  // find by id
  findByIdAndPopulate: async({id})=>{
    try {
      const payment = await PaymentModel.findById(id).populate("userId").lean();
      return payment;
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }
};

module.exports = {
  paymentQueries,
};
