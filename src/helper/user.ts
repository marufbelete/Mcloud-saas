import { Request } from "express";
import jwt from 'jsonwebtoken'
import User from "../model/user";
// const cookieExtractor = function(req:Request) {
//     var token = null;
//     if (req && req.cookies)
//     {
//         token = req.cookies['jwt'];
//     }
//     return token;
// };

const issueToken = async function(id:string,email:string,isAdmin:boolean,key:string) {
    const token = jwt.sign({ sub:id,email,isAdmin }, key);
    return token
  }
const isEmailExist=async(email:string)=>{
    const user= await User.findOne({email:email})
    if(user){return true}
    else{return false}
}

const findOneOrCreate=async(userInfo:any)=>{
const user=await User.findOne({email:userInfo.email})
if(!user){
   return await User.create(userInfo)
}
return user
}
  

export {
    // cookieExtractor,
    issueToken,
    isEmailExist,
    findOneOrCreate
}