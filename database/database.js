const {MongoClient} = require('mongodb');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const database = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = database;