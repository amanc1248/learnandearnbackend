const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
dotenv.config();
const database = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a new MongoClient
const db = async()=>{
  try{
    const mongoClient = new MongoClient(process.env.MONGO_URL);
    const connection = mongoClient.connect()
    if(connection){
      const db = connection.db(process.env.DATABASE);
      return db;
    }else{
    }
  }catch(error){
    console.error(error);
  }
}
module.exports = {
  database,
  db,
};
