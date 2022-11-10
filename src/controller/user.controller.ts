
import { Request,Response,NextFunction } from "express";
import User from "../model/user";
import bcrypt from 'bcrypt'
import { issueToken,isEmailExist } from "../helper/user";

const registerUser=async(req:Request,res:Response,next:NextFunction)=>{
  try{
  const {firstName,lastName,email,password,confirmPassword}=req.body
  console.log(req.body)
  if(await isEmailExist(email))
  {
    const error:NodeJS.ErrnoException = new Error("account with this email already exist.")
    error.code = 403
    throw error;
  }
  if(!firstName||!lastName||!email||!password||!confirmPassword)
  {
    const error:NodeJS.ErrnoException = new Error("please fill all field.")
    error.code = 403
    throw error;
  }
  if(password!!==confirmPassword)
  {
    const error:NodeJS.ErrnoException = new Error("password doesn't match. please try again.")
    error.code = 403
    throw error; 
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const newUser=new User({
    firstName,
    lastName,
    email,
    password:passwordHash
  })
  await newUser.save()
  return res.json({success:true})
  }
  catch(err){
    next(err)
  }
}



const loginUser=async(req:Request,res:Response,next:NextFunction)=>{
  try{
  const {email,password}=req.body
  if(!email||!password)
  {
    const error:NodeJS.ErrnoException = new Error("please fill all field.")
    error.code = 403
    throw error;
  }
  const user = await User.findOne({
    email: email,
  });
  if(!user) {
    const error:NodeJS.ErrnoException = new Error("No account with this email exist" )
    error.code = 400
    throw error;
  }
  console.log(user.password,password)
  const isMatch = await bcrypt.compare(password,user.password)
  console.log(isMatch)
  if (!isMatch) {
    const error:NodeJS.ErrnoException = new Error("Invalid credential.")
    error.code = 400
    throw error;
  }
  const token = await issueToken(user._id,user.email,user.isAdmin,"marufbelete");
  const leftUser={
    firstName:user.firstName,
    lastName:user.lastName,
    email:user.email,
    isAdmin:user.isAdmin
  }
  return res.cookie("access_token",token,{
    sameSite:'none',
    path:'/',
    secure:true}).json({auth:true,success:true,user:leftUser})
  }
  catch(err){
    next(err)
  }
}

export{
  registerUser,
  loginUser

}

