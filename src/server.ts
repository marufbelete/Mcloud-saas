import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose'
import user from './route/user.route'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
require('dotenv').config()

const app: Express = express();
app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: false,
  store:MongoStore.create({mongoUrl: 'mongodb+srv://maruf:maruf@cluster0.l2ygl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'})
}))
/** Logging */
import googlePassport from "./auth/passport_google"
import facebookPassport from "./auth/passport_facebook"

app.use(passport.initialize());
app.use(passport.session());
// jwtPassport(passport);
googlePassport(passport);
facebookPassport(passport);

app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());
/** Remove X-Powered-By */
app.disable('x-powered-by');
app.use(cookieParser())

const corsOptions = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'origin, X-Requested-With,Content-Type,Accept, Authorization, Content-Type',
    methods: 'GET,POST,DELETE,PUT,PATCH',
    Accept: 'application/json',
    origin: true,
    credentials: true,
    withCredentials: true,
};
app.use(cors(corsOptions));
app.use(user)
/** Server */
mongoose.connect("mongodb+srv://maruf:maruf@cluster0.l2ygl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
mongoose.connection.on("error", err => {
  console.log("err please try again")
})
mongoose.connection.on("connected", (err, res) => {
  const PORT = 7000
  app.listen(PORT, () => {
    console.log(`app is listening to PORT ${PORT}`)
  })
})
