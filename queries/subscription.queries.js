const SubscriptionModel = require("../models/subscription.model");
const subscriptionQueries = {
  // save subscription
  save: async ({ obj }) => {
    try {
      const subscription = new SubscriptionModel(obj);
      const createdSubscription = await subscription.save();
      if (createdSubscription) return createdSubscription;
    } catch (error) {
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
};
module.exports ={
  subscriptionQueries,
}