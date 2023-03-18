const User = require("../../models/user.model");

const saveUser = async ({ name, email, password }) => {
  try {
    const newUser = new User({
      name,
      email,
      password,
    });
    const createdUser = await newUser.save();
    if (createdUser) return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};

const findUserByEmail = async ({ email }) => {
  try {
    const user = await User.findOne({ email }, { email: 1, password: 1 }).lean();
    if (user) return user;
    return null;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const updateUserPassword = async({email, password})=>{
  try{
    const result =  await User.findOneAndUpdate({email},{$set: {password}}).lean();
    if(result){
      return "success";
    }
  }catch(error){
    console.error(error)
    throw new Error(error);
  }
}
module.exports = {
  findUserByEmail,
  saveUser,
  updateUserPassword,
};