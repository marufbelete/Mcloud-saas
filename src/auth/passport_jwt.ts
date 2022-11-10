import passportJWT from "passport-jwt"
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import User from "../model/user"

const option={
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'marufbelete'
}
const strategy=new JWTStrategy(option,async(jwtPayload, done)=>{
    try{
        const user =await User.findById(jwtPayload.sub)
        if(!user){return done(null,false)}
        return done(null,user)
    }
    catch(err)
    {
        return done(err,false)
    }
})

export default (passport:any)=>{
 passport.use(strategy) 
}
 