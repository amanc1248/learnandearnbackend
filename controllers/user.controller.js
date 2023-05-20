const {
  validatePassword,
  generateHashedPassword,
} = require("../utils/password.util");
const { generateJwt } = require("../utils/jwt.util");
const { sendEmail } = require("../utils/email.util");
const { userQueries } = require("../queries/user.queries");
const mongoose = require("mongoose");

// create user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await generateHashedPassword({ password });
    const userObj = {
      name,
      email,
      password: hashedPassword,
      joinedDate: new Date(),
      type: "user",
    };
    const createdUser = await userQueries.save({ userObj });
    if (createdUser) {
      const { name, email, _id } = createdUser._doc;
      req.user = { name, email, _id };
      next();
    }
  } catch (error) {
    res.status(500).send("error creating user");
  }
};

// send email for slack invitation after creating user
const sendSlackInvitationEmail = async (req, res, next) => {
  try {
    const { name, email } = req.user;
    const sentEmail = await sendEmail({
      email,
      subject: "Slack Invitation",
      emailText: `Hello ${name}! You are invited to join our slack channel`,
    });
    if (sentEmail) {
      return res.status(200).send("success");
    }
  } catch (error) {
    res.status(500).send("error creating user");
  }
};
// get user
const checkUserIfExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    const criteria = { email };
    const user = await userQueries.findOne({ criteria });
    if (user) {
      res.status(409).send("User already exists with this email address");
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// user login
const userLogin = async (req, res, next) => {
  try {
    const { email } = req.query;
    const criteria = { email };
    const user = await userQueries.findOne({ criteria });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// check if user password is valid
const validateUserPassword = async (req, res, next) => {
  try {
    const { password: hashedPassword } = req.user;
    const { password } = req.query;
    const isPasswordValid = await validatePassword({
      password,
      hashedPassword,
    });
    if (isPasswordValid) {
      next();
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// generate jwt token
const generateJwtToken = async (req, res, next) => {
  try {
    const { email } = req.query;
    const expiresIn = "1h";
    const jwt = await generateJwt({ email, expiresIn });
    if (jwt) {
      res.status(200).send(jwt);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// check if user exists before sending otp
const checkIfuserExistsBeforeSendingOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const criteria = { email };
    const user = await userQueries.findOne({ criteria });
    if (user) {
      res.status(409).send("User already exists. Please login.");
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// check if user exists or not before sending otp for resetting password
const checkIfUserExistsForResetingPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const criteria = { email };
    const user = await userQueries.findOne({ criteria });
    if (user) {
      next();
    } else {
      res.status(409).send("User does not exist with that email address");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// reset user password
const resetUserPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await generateHashedPassword({ password });
    const filter = { email };
    const updateObj = { password: hashedPassword };
    const result = await userQueries.updateOne({ filter, updateObj });
    if (result) return res.status(200).send("success");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// send user details
const sendUserDetails = async (req, res, next) => {
  try {
    const { user } = req;
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// udpate user emial
const udpateUserEmail = async (req, res, next) => {
  try {
    const { id, email, newEmail } = req.body;
    const filter = { _id: id, email };
    const updateObj = { email: newEmail };
    const updatedUser = await userQueries.updateOne({ filter, updateObj });
    if (updatedUser) {
      req.updatedUser = updatedUser;
      next();
    }
    return null;
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// generate jwt when change email
const generateJWTWhenChangedEmail = async (req, res, next) => {
  try {
    const updatedUser = req.updatedUser;
    const { email } = updatedUser;
    const expiresIn = "1h";
    const jwt = await generateJwt({ email, expiresIn });
    if (jwt) {
      res.status(200).send({ jwt, updatedUser });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// change user password
const changeUserPassword = async (req, res, next) => {
  try {
    const { email, newPassword, currentPassword } = req.body;
    const criteria = { email };
    const user = await userQueries.findOne({ criteria });
    if (!user) return res.status(400).send("user not found");
    const isPasswordValid = await validatePassword({
      password: currentPassword,
      hashedPassword: user.password,
    });
    if (!isPasswordValid)
      return res.status(400).send("Current password is incorrect");
    const hashedPassword = await generateHashedPassword({
      password: newPassword,
    });
    const updateCriteria = { email };
    const updateObj = { password: hashedPassword };
    const updatedUserPassword = await userQueries.updateOne({
      filter: updateCriteria,
      updateObj,
    });
    if (!updatedUserPassword)
      return res.status(400).send("Something went wrong updating the password");
    return res.status(201).send("success");
  } catch (e) {
    console.error(error);
    return res.status(400).send(e);
  }
};

// admin login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.query;
    const criteria = { email, type: "admin" };
    const user = await userQueries.findOne({ criteria });
    if (!user) return res.status(400).send("Admin does not exist");
    const isPasswordValid = await validatePassword({
      password,
      hashedPassword: user.password,
    });
    if (!isPasswordValid) return res.status(400).send("Password did not match");
    req.user = user;
    return next();
  } catch (e) {
    console.error(e);
    res.status();
  }
};

// get all users for admin
const adminGetAllUsers = async (req, res, next) => {
  try {
    const aggregateArray = [
      // Match the user based on user ID
      {
        $match: {
          type: "user"
        }
      },
      // Join with the Payment collection to get all the payments made by the user
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "userId",
          as: "payments",
        },
      },
      // Join with the Subscription collection to get all the subscriptions made by the user
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "userId",
          as: "subscriptions",
        },
      },
      {
        $addFields: {
          activeSubscriptions: {
            $filter: {
              input: "$subscriptions",
              as: "subscription",
              cond: {
                $eq: ["$$subscription.isSubscriptionActive", true],
              },
            },
          },
        },}
    ];
    const users = await userQueries.aggregate({ aggregateArray });
    if (!users.length) return res.status(400).send("Users not found");
    return res.status(200).send(users);
  } catch (error) {
    console.error(error)
  }
};

// get full details of the user
const getFullDetailsOfUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const aggregateArray = [
      // Match the user based on user ID
      { $match: { _id: mongoose.Types.ObjectId(userId) } },
      // Join with the Payment collection to get all the payments made by the user
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "userId",
          as: "payments",
        },
      },
      // Join with the Subscription collection to get all the subscriptions made by the user
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "userId",
          as: "subscriptions",
        },
      },
    ];
    const user = await userQueries.aggregate({ aggregateArray });
    if (!user.length) return res.status(400).send("User Details not found");
    return res.status(200).send(user[0]);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

// get user data
const getUserData  = async(req,res,next)=>{
  try {
    const {_id} = req.user;
    const user = await userQueries.findOne({criteria:mongoose.Types.ObjectId(_id)});
    if(!user) return res.status(400).send("User not found");
    return res.status(200).send(user);
  } catch (error) {
    console.error(error)
    res.status(400).send("something went wrong");
  }
}

// upgrade is upgradeable
const updateIsUpgradeable = async(req,res,next)=>{
  try {
    const {_id} = req.user;
    const filter = {_id: mongoose.Types.ObjectId(_id)};
    const updateObj = {isUpgradable: false}
    const user = await userQueries.updateOne({filter, updateObj});
    if(!user) res.status(400).send("Something went wrong") 
    next();
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}
module.exports = {
  createUser,
  checkUserIfExists,
  userLogin,
  validateUserPassword,
  generateJwtToken,
  checkIfuserExistsBeforeSendingOTP,
  checkIfUserExistsForResetingPassword,
  resetUserPassword,
  sendUserDetails,
  udpateUserEmail,
  generateJWTWhenChangedEmail,
  changeUserPassword,
  sendSlackInvitationEmail,
  adminLogin,
  getFullDetailsOfUser,
  adminGetAllUsers,
  getUserData,
  updateIsUpgradeable,
};
