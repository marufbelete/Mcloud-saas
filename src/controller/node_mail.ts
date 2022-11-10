import nodemailer from 'nodemailer';
import { google} from 'googleapis';
import { Request,Response,NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import User from "../model/user";

exports.sendEmail = async (req:Request,res:Response,next:NextFunction) => {
    try {
      const email=req.body.email
      let response
      const token = jwt.sign({ email:email},"maruf",{expiresIn:'20m'});
      const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
      );
      oAuth2Client.setCredentials({ refresh_token:process.env.REFRESH_TOKEN });
      const accessToken:any = await oAuth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken:process.env.REFRESH_TOKEN,
          accessToken:accessToken        
          
        }
      });
      const mailOptions = {
        from:process.env.EMAIL,
        to: email,
        subject: 'Password Reseting Link',
        text: 'Follow the link to reset your password you will have ten minute before the link expired!',
        html:`http://137.184.143.106:3000/resetpassword/${token}`
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          response={status:false,message:'sending email fail please try again.'}
         return 
        } else {
          response={status:true,message:'email sent.'}
          return 
        }
      });
      return res.json(response)
    }
    catch(err){
  next(err)
    }
  }
  
  exports.resetPassword=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    const token= req.params.token
    const password=req.body.password
    jwt.verify(token, "maruf", async(err, user:any) => {
    if (err) {
      if(err.name == "TokenExpiredError")
      {
        return res.status(403).send({ msg: "your link expired please try again" });
        
      }
    }
    else{
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate({username:user.email},{
        password:passwordHash
      })
        return res.json({reset:true,})
    }
  })
   }
  catch(err){
    next(err)
      }
  
  }
  