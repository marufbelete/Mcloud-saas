import {NextFunction, Request,Response} from 'express'

const errorHandler = (err:NodeJS.ErrnoException,req:Request,res:Response,next:NextFunction) =>{
!!err.code? err.code : err.code=500;
console.log(err.message,err.code)
    return res.status(err.code).json({message:err.message,status:false});
}

export default errorHandler
