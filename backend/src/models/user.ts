import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
  
  _id: string;
  name: string;
  email: string;
  password: string;
  country: string;
  profilephoto?: string | null;  
  resetPasswordToken?: string; 
  resetPasswordExpire?: number;
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  profilephoto: { type: String, default: null },  
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Number },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8); 
  }
  next();
});



const User = mongoose.model<UserType>("User", userSchema); 

export default User;
