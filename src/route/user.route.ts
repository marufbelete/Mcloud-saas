import express,{Router,Request,Response,NextFunction} from 'express';
import passport from 'passport'
import errorHandler from "../middleware/errohandling.middleware"
import {registerUser,loginUser} from '../controller/user.controller'
import { checkAuthenticated } from '../middleware/chechAuth';
const router:Router = express.Router();

router.post('/register',registerUser,errorHandler)
router.post('/login',loginUser,errorHandler)
// router.get('/protected',
// passport.authenticate('jwt',{session: false}),
// async(req:Request,res:Response,next:NextFunction)=>{
// return res.json({message:"hello world"})
// })
//google
router.get("/auth/google", passport.authenticate("google", { scope: ["email","profile"] }));
router.use("/auth/google/callback",
passport.authenticate("google", 
{
failureRedirect: "http://localhost:3000/login",
successRedirect:"http://localhost:3000/home"
}));
//facebook
router.get("/auth/facebook", passport.authenticate("facebook"));
router.use("/auth/facebook/callback",
passport.authenticate("facebook", 
{
failureRedirect: "http://localhost:3000/login",
successRedirect:"http://localhost:3000/home"
}));
//protected
router.get('/home',
checkAuthenticated,
async(req:Request,res:Response,next:NextFunction)=>{
return res.json({message:"hello world"})
})
export default router

