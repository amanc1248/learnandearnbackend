const { uploadImageUtil } = require("../../utils/image.utils");
const { paymentSubController } = require("./payment.subController");

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
    };
    paymentObject.paymentId = "paymentId";
    paymentObject.transactionId = "transactionId";
    paymentObject.date = new Date();
    if (method === "bankTransfer") {
      const { bankAccountNumber, bankName } = req.body;
      paymentObject.bankAccountNumber = bankAccountNumber;
      paymentObject.bankName = bankName;
    }
    if (method === "walletTransfer") {
      const { walletName } = req.body;
      paymentObject.walletName = walletName;
    }

    const createdPayment = await paymentSubController.save({ paymentObject });
    if (!createdPayment)
      return res.status(400).send("Something went wrong creating payment");
    return res.status(200).send("success");
  } catch (error) {
    console.error(error);
    return res.status(404).send(error);
  }
};

// get paymentByUserId
const getPaymentByUserIdReviewStatus = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const reviewStatus = "inReview";
    const payment = await paymentSubController.findOne({
      userId,
      reviewStatus,
    });
    if (!payment) return res.status(200).send(null);
    res.status(200).send(payment);
  } catch (e) {
    console.log(e);
    res.status(400).send("Something went wrong");
  }
};

// get all payments of the user
const getAllPayments = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const payment = await paymentSubController.find({userId: _id});
    return res.status(200).send(payment);
  } catch (e) {
    console.error(e)
    res.status(400).send("Something went wrong fetching all payments")
  }
};

module.exports = {
  createPayment,
  getPaymentByUserIdReviewStatus,
  getAllPayments,
};
