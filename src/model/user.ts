import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password:string;
  isAdmin:boolean;
  isVerified:boolean;
  profileImg:string;
  googleId:string;
  facebookId:string;

}

const UserSchema: Schema = new Schema({
  firstName: { type: String},
  lastName: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String},
  isAdmin: { type: Boolean, required: true,default:false },
  isVerified: { type: Boolean, required: true,default:false },
  profileImg:{ type: String },
  googleId:{ type: String },
  facebookId:{ type: String }
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);