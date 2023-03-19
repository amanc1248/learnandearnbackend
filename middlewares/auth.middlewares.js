const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user.model");
dotenv.config();
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send("no token");
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) return res.sendStatus(403);
        const { email } = user;
        const data = await User.findOne({ email }, { email: 1, name: 1 }).lean();
        if (data) {
          req.user = data;
          next();
        } else {
          return res.status(403).send("invalid token");
        }
      });
    }
  } catch (error) {}
};
module.exports = {
  authenticateToken,
};
