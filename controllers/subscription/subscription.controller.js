const { subscriptionSubController } = require("./subscription.subController");

const checkSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const subscription = await subscriptionSubController.findByUserId({
      userId:_id,
    });
    if (subscription)
      return res.status(404).status("Already active subscription");
    return next();
  } catch (error) {
    console.error(error);
    res.status(404).status("Something went wrong");
  }
};

const createSubscription = async (req, res, next) => {
  try {
    // const
    const {
      subscriptionStartDate,
      subscriptionEndDate,
      subscriptionAmount,
      subscriptionType,
      isSubscriptionActive,
      paymentId,
      userId,
    } = req.body;
  } catch (error) {}
};
module.exports = {
  createSubscription,
  checkSubscription,
};
