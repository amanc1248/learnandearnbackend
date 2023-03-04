const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const { response } = require("express");
const createUser = (req, res, next) => {
  try {
    const {name, email, password } = req.body;

    // Generate a salt
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    // Hash the password with the salt
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      salt,
    });

    // save the user to the database
    newUser
      .save()
      .then(() => {
        res.status(201).send("success");
        console.log("User created")})
      .catch((err) => {
        console.log(err)
        res.status(500).send("error creating user");
      });
  } catch (error) {
    res.status(500).send("error creating user");
  }
};

// get user
const checkUserIfExists = async(req,res,next)=>{
  try{
    const {email} = req.body;
    const user = await User.findOne({email}).lean();
    if(user){
      res.status(409).send("User already exists with this email address");
    }else{
      next()
    }
  }catch(error){
    res.status(400).send(error);
  }
}

module.exports = {
  createUser,
  checkUserIfExists,
};
