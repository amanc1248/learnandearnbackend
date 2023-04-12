const SubscriptionModel = require("../../models/subscription.model");
const subscriptionSubController = {
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

  // find subscription userId
  findByUserId: async ({ userId }) => {
    try {
      const subscription = await SubscriptionModel.findOne({
        userId,
        isSubscriptionActive: true,
      }).lean();
      if (!subscription) return null;
      return subscription;
    } catch (error) {
      throw new Error(error);
    }
  },
};
module.exports ={
  subscriptionSubController
}