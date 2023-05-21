const mongoose = require("mongoose");
const { paymentQueries } = require("../queries/payment.queries");
const { subscriptionQueries } = require("../queries/subscription.queries");
const { uploadImageUtil } = require("../utils/image.utils");
const { sendEmail } = require("../utils/email.util");
const { userQueries } = require("../queries/user.queries");

// add payment
const createPayment = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const uploadedImageUrl = req.uploadedImageUrl;
    const {
      amount,
      item,
      method,
      fullName,
      billingAddress,
      paymentDate,
      additionalInformation,
    } = req.body;
    const paymentObject = {
      amount,
      item,
      method,
      fullName,
      billingAddress,
      paymentDate,
      paymentImage: uploadedImageUrl,
      additionalInformation,
      userId: _id,
      paymentStatusInformation: "Your payment is in review. We will let you know the status of your payment in email."
    };
    paymentObject.paymentId = "paymentId";
    paymentObject.transactionId = "transactionId";
    paymentObject.date = new Date();
    if (method === "bankTransfer") {
      const { bankName } = req.body;
      paymentObject.bankName = bankName;
    }
    if (method === "walletTransfer") {
      const { walletName } = req.body;
      paymentObject.walletName = walletName;
    }

    const createdPayment = await paymentQueries.save({ paymentObject });
    if (!createdPayment)
      return res.status(400).send("Something went wrong creating payment");
    next();
  } catch (error) {
    console.error(error);
    return res.status(404).send(error);
  }
};

// get paymentByUserId
const getPaymentStatus = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const criteria = {userId:mongoose.Types.ObjectId(_id), isSubscriptionActive: true};
    const subscription = await subscriptionQueries.findOne({criteria});

    const paymentCriteria = {userId:mongoose.Types.ObjectId(_id), reviewStatus:"inReview"};
    const payment = await paymentQueries.findOne({criteria: paymentCriteria});

    // condition 1: when payment is in review and subscription is free
    if(payment){
      res.status(200).send({show: false, paymentStatusInformation:  payment?.paymentStatusInformation})
    }
    
    // condition 2: when there is no payment and subscription is Pro
    if(!payment && subscription.subscriptionType==="Pro"){
      res.status(200).send({show: false})
    }

    if(!payment && subscription.subscriptionType==="Free"){
      res.status(200).send({show: true});
    }

    // const { _id: userId } = req.user;

    // const reviewStatus = "inReview";
    // const payment = await paymentQueries.findOne({
    //   userId,
    //   reviewStatus,
    // });
  } catch (e) {
    console.log(e);
    res.status(400).send("Something went wrong");
  }
};

// get all payments of the user
const getAllPaymentsOfTheUser = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const criteria ={userId: _id};
    const payment = await paymentQueries.find({criteria});
    return res.status(200).send(payment);
  } catch (e) {
    console.error(e)
    res.status(400).send("Something went wrong fetching all payments")
  }
};

// get single payment
const getSinglePayment  = async(req,res,next)=>{
  try {
    const {paymentId} = req.query;
    const payment = await paymentQueries.findByIdAndPopulate({id:mongoose.Types.ObjectId(paymentId)});
    if(!payment) return res.status(400).send("Payment not found")
    return res.status(200).send(payment)
  } catch (error) {
    console.error(error)
    res.status(400).send("Something went wrong fetching payment")
  }
}

// get all payments
const getAllPayments = async(req,res,next)=>{
  try {
    const payments = await paymentQueries.findAllAndPopulate({populateField:"userId"});
    if(!payments.length) return res.status(400).send("Payments not found");
    return res.status(200).send(payments);
  } catch (error) {
    console.error(error)
    res.status(400).send("Something went wrong fetching payments");
  }
}

// update payment by id
const updatePaymentById = async(req,res,next)=>{
  try {
    const {reviewStatus, _id, userId} = req.body;
    const id = mongoose.Types.ObjectId(_id);
    reviewStatus==='verified'? paid=true: paid=false;
    const updateObj = {reviewStatus, paid};
    
    // 1. fetch user
    const user = await userQueries.findOne({criteria: {_id:mongoose.Types.ObjectId(userId)}});
    const {email, name} = user;

    // 2. update payment
    const response = await paymentQueries.findByIdAndUpdate({id, updateObj});
    if(!response) res.status(400).send("Cannot update payment");
    if(reviewStatus!=="verified"){
      await sendEmail({email, subject: "Payment Status", emailText:`Dear ${name}, sorry to inform that your payment is ${reviewStatus}`});
      res.status(400).send("Success");
    } 

    // 3. update subscription
    await subscriptionQueries.findOneAndUpdate(
      {
        condition:{userId: mongoose.Types.ObjectId(userId), isSubscriptionActive:true},
        update: {isSubscriptionActive: false}
      },
    );

    // 4. find payment and create subscription
    const updatedPayment = await paymentQueries.findOne({criteria:{_id:id,userId: mongoose.Types.ObjectId(userId) } });
    if(!updatedPayment) res.status(400).send("No updated payment");

    // Get the current date
    var currentDate = new Date();
    var futureDate = new Date();
    futureDate.setMonth(currentDate.getMonth() + 6);

    const createSubscription = {
      subscriptionStartDate: currentDate,
      subscriptionEndDate: futureDate,
      subscriptionAmount: updatedPayment.amount,
      subscriptionType: "Pro",
      subscriptionItem: updatedPayment.item,
      isSubscriptionActive: true,
      userId,
    };
    await subscriptionQueries.save({obj: createSubscription}); 
    if(!createSubscription) res.status(400).send("Could not create subscription");

    // 5. send payment status in email
    await sendEmail({email, subject: "Payment Status", emailText:`Dear ${name}, Your Payment is ${reviewStatus} and you are a pro member from now`});
    res.status(200).send("Success Updating payment");
  } catch (error) {
    console.error(error)
    res.status(400).send("Something went wrong updating payment")
  }
}

// send email after creating payment
const sendEmailAfterCreatingPayment = async(req,res,next)=>{
  try {
    const {email, name} = req.user;
    const subject = "Payment Received";
    const emailText = `Dear, ${name}. 
    We have received your payment and we will let you know the status of your payment by email.
    Thank you for choosing us.
    `
    const response = await sendEmail({email, subject, emailText});
    if(!response) res.status(400).send("Something went wrong sending email");
    res.status(200).send("success");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

module.exports = {
  createPayment,
  getPaymentStatus,
  getAllPaymentsOfTheUser,
  getSinglePayment,
  getAllPayments,
  updatePaymentById,
  sendEmailAfterCreatingPayment,
};
