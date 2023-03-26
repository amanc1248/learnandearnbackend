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

const updateUserEmail = async({id, oldEmail, newEmail})=>{
  try{
    const updatedUser = await User.findOneAndUpdate({_id:id, email:oldEmail},{$set:{email:newEmail}}, {projection:{_id:1, email:1, name:1}, returnOriginal: false}).lean();
    if(updatedUser) return updatedUser;
    return null;
  }catch(error){
    console.error(error)
    throw new Error(error);
  }
}
module.exports = {
  findUserByEmail,
  saveUser,
  updateUserPassword,
  updateUserEmail,
};
