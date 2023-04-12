const { paymentSubController } = require("./payment.subController");

// add payment
const createPayment = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const {
      amount,
      item,
      method,
      fullName,
      billingAddress,
      paymentDate,
      paymentImage,
      additionalInformation,
    } = req.body;
    const paymentObject = {
      amount,
      item,
      method,
      fullName,
      billingAddress,
      paymentDate,
      paymentImage,
      additionalInformation,
      userId: _id,
    };
    paymentObject.paymentImage = "paymentImage";
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

module.exports = { createPayment };
