import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signup=async (req,res)=>{
    const {email,userName,password}=req.body; 
    try {
        if(!email || !userName || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<8){
            return res.status(400).json({message:"Password must be at least 8 characters"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            email ,
            userName,
            password:hashedPassword
        })
        if(newUser) {
            // First save the user
            await newUser.save();

            // Then generate token
            const token = generateToken(newUser._id, res);
            
            // Send response with user data
            return res.status(201).json({
                _id: newUser._id.toString(),
                email: newUser.email,
                userName: newUser.userName,
                profilePic: newUser.profilePic,
                token
            });
        }else{
            return res.status(400).json({message:"Invalid user data"});
        }
        
    } catch (error) {
        console.log("Error in signup controller : "+error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const login=async (req,res)=>{
    const {email,password}=req.body

    try {
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or not exist"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid password"});
        }
        const token=generateToken(user._id,res);
        return res.status(200).json({
            _id: user._id,
            email: user.email,
            userName: user.userName,
            profilePic: user.profilePic,
        }); 
    } catch (error) {
        console.log("Error in login controller : "+error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const logout=(req,res)=>{
    try {
        res.cookie('token',{
            maxAge:0,
        })
        return res.status(200).json({message:"Logged out successfully"});
        
    } catch (error) {
        console.log("Error in logout controller : "+error);
        return res.status(500).json({message:"Internal server error"}); 
    }
}
export const updateProfile=async (req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profile picture is required"});
        }
        const upload=await cloudinary.uploader.upload(profilePic)
        const updateUser= await User.findByIdAndUpdate(userId,{profilePic : uploadResponse.secure_url},{new:true});
        res.status(200).json({message:"Profile updated successfully",user:updateUser});
    } catch (error) {
        console.log("Error in updateProfile controller : "+error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller : "+error);
        return res.status(500).json({message:"Internal server error"});
    }
}