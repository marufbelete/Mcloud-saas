import User from "../model/user";
import {findOneOrCreate} from '../helper/user';
// const GoogleStrategy =("passport-google-oauth20").Strategy();
import passportFacebook from 'passport-facebook';
const FacebookStrategy = passportFacebook.Strategy
export default (passport:any)=>{
passport.use(new FacebookStrategy({
    clientID:process.env.FB_CLIENT_ID!,
    clientSecret: process.env.FB_CLIENT_SECRET!,
    callbackURL: process.env.FB_CALLBACK_URL!,
    profileFields: ['id', 'displayName' , 'picture.type(large)', 'name', 'emails']
  },
  async function(accessToken:any, refreshToken:any, profile:any, done:any) {
    try{
        console.log(profile._json.picture)
      const userInfo=
        {
        firstName:profile._json.first_name,
        lastName:profile._json.last_name,
        email:profile._json.email,
        facebookId:profile._json.id,
        profileImg:profile._json.picture?.data?.url
        }
      const user=await findOneOrCreate(userInfo)
      done(null, user)
    }
    catch(err){
      done(err, null)

    }
  }
));

// attach the {authenticate_user} to 
//    req.session.passport.user.{authenticated_user}
passport.serializeUser(function(user:any, done:any) {
  console.log("serlizer")
  done(null, user._id);
});
// get the {authenticated_user} for the session from    
//    "req.session.passport.user.{authenticated_user}, and attach it to    
//    req.user.{authenticated_user}
passport.deserializeUser(async function(id:any, done:any) {
  console.log("deserlizer")
 const user= await User.findById(id)
 console.log(user)
 done(null, user)
  // User.findById(id, function(err:any, user:any) {
  //   done(err, user);

  // });
});
}

// req.isAuthenticated()
// req.logOut()



// //facebook strategy
// passport.use(new facebookStrategy({

//   // pull in our app id and secret from our auth.js file
//   clientID        : process.env.FACEBOOK_CLIENT_ID,
//   clientSecret    : process.env.FACEBOOK_SECRET_ID,
//   callbackURL     : "http://localhost:3000/facebook/callback",
//   profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']

// },// facebook will send back the token and profile
// function(token, refreshToken, profile, done) {

//   console.log(profile)
//   return done(null,profile)
// }));

// //LinkedIn strategy
// passport.use(new LinkedInStrategy({
//   clientID        : process.env.LINKEDIN_CLIENT_ID,
//   clientSecret    : process.env.LINKEDIN_SECRET_ID,
//   callbackURL: "http://localhost:3000/linkedin/callback",
//   scope: ['r_emailaddress', 'r_liteprofile'],
// }, function (token, tokenSecret, profile, done) {
//   return done(null, profile);
// }
// ));

// //Twitter Strategy
// passport.use(new TwitterStrategy({
//   clientID        : process.env.TWITTER_CLIENT_ID,
//   clientSecret    : process.env.TWITTER_SECRET_ID,
//   callbackURL: "http://localhost:3000/twitter/callback",
// }, function (token, tokenSecret, profile, cb) {
//   console.log('call');
//   process.nextTick(function () {
//       console.log(profile);
//   });
// }));
// }