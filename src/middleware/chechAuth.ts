import {NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";

const checkAuthenticated = (req:Request, res:Response, next:NextFunction) => {
  if (req.isAuthenticated()) { return next() }
  const token =req.cookies.access_token;
  if(token)
  {
    jwt.verify(token,"marufbelete", (err:any, user:any) => {
      if (err) {
        return res.status(403).json({auth:false,status:false});
      }
      req.user = user;
      next();
    }) 
  }
  else {
    return res.status(403).json({auth:false,status:false});
  }
}


export{
    checkAuthenticated
}

