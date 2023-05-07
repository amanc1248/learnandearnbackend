const { model } = require("mongoose");
const User = require("../models/user.model");

// const saveUser = ;

// const findUserByEmail = ;

// const updateUserPassword = 

// const updateUserEmail = async({id, oldEmail, newEmail})=>{
//   try{
//     const updatedUser = await User.findOneAndUpdate({_id:id, email:oldEmail},{$set:{email:newEmail}}, ).lean();
//     if(updatedUser) return updatedUser;
//     return null;
//   }catch(error){
//     console.error(error)
//     throw new Error(error);
//   }
// }
// module.exports = {
//   findUserByEmail,
//   saveUser,
//   updateUserPassword,
//   updateUserEmail,
// };

const userQueries = {
  save: async ({userObj}) => {
    try {
      const newUser = new User(userObj);
      const createdUser = await newUser.save();
      if (createdUser) return createdUser;
    } catch (error) {
      console.error(error)
      throw new Error(error);
    }
  },
  
  // find one
  findOne: async ({criteria}) => {
    try {
      const user = await User.findOne(criteria, { email: 1, password: 1 }).lean();
      if (user) return user;
      return null;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  // find
  find: async({criteria})=>{
    try{
      const users = await User.find(criteria).lean();
      return users;
    }catch(e){
      console.error(e);
      throw new Error(e)
    }
  },

  // update one
  updateOne: async({filter, updateObj})=>{
    try{
      const result =  await User.findOneAndUpdate(filter,{$set: updateObj},{projection:{_id:1, email:1, name:1}, returnOriginal: false}).lean();
      if(result) return result;
    }catch(error){
      console.error(error)
      throw new Error(error);
    }
  },

  //  aggregate
  aggregate: async({aggregateArray})=>{
    try {
      const user = await User.aggregate(aggregateArray);
      if(!user.length)return null;  
      return user[0];
    } catch (error) {
      
    }
  },
}
module.exports={
  userQueries
}