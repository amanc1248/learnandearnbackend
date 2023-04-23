const { subscriptionSubController } = require("./subscription.subController");

const checkSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const subscription = await subscriptionSubController.findOne({
      criteria: {
        userId: _id,
        isSubscriptionActive: true,
        subscriptionType: { $in: ["yearlyPlan", "sixMonthPlan"] },
      },
    });
    if (subscription)
      return res.status(404).send("Already active subscription");
    return next();
  } catch (error) {
    console.error(error);
    res.status(404).send("Something went wrong");
  }
};

const createSubscriptionAfterCreatingUser = async (req, res, next) => {
  try {
    const subscriptionObject = {
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(),
      subscriptionAmount: 0,
      subscriptionType: "Free",
      isSubscriptionActive: true,
      userId: req.user._id,
    };
    const createdSubscription = await subscriptionSubController.save({
      obj: subscriptionObject,
    });
    if (!createdSubscription)
      res.status(400).send("Something went wrong creating subscription");
    res.createdSubscription = createdSubscription;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).send("Something went wrong creating subscription");
  }
};

// get all active subscription of the user
const getAllActiveSubscriptionOfTheUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const subscriptions = await subscriptionSubController.findOne({
      criteria: {
        userId: _id,
        isSubscriptionActive: true,
        subscriptionType: "Free",
      },
    });
    if (!subscriptions) return res.status(400).send("No active subscription");
    res.status(200).send(subscriptions);
  } catch (e) {
    console.error(e);
    res
      .status(400)
      .send("Something went wrong fetching all active subscription.");
  }
};
module.exports = {
  createSubscriptionAfterCreatingUser,
  checkSubscription,
  getAllActiveSubscriptionOfTheUser,
};
