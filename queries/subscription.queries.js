const { default: mongoose } = require("mongoose");
const SubscriptionModel = require("../models/subscription.model");
const subscriptionQueries = {
  // save subscription
  save: async ({ obj }) => {
    try {
      const subscription = new SubscriptionModel(obj);
      const createdSubscription = await subscription.save();
      if (createdSubscription) return createdSubscription;
    } catch (error) {
      console.error(error)
      throw new Error(error);
    }
  },

  // find one
  findOne: async ({ criteria }) => {
    try {
      const subscription = await SubscriptionModel.findOne(criteria).lean();
      if (!subscription) return null;
      return subscription;
    } catch (error) {
      throw new Error(error);
    }
  },

  // find by id
  findByIdAndPopulateUser: async({_id})=>{
    try {
      const subscription = await SubscriptionModel.findById(mongoose.Types.ObjectId(_id)).populate("userId").lean();
      return subscription;
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  },

  // update by id
  findOneAndUpdate: async({condition, update})=>{
    try {
      const response = await SubscriptionModel.findOneAndUpdate(condition, {$set:update});
      return response;
    } catch (error) {
      console.error(error);
      throw new Error(error)
    }
  }
};
module.exports ={
  subscriptionQueries,
}