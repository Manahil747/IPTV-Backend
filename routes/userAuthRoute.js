const express=require("express");
const mongoose=require("mongoose");
const responseModel=require("../utils/responseModel");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const { response } = require("./genreRoutes");
const user = require("../models/user");
const router=express.Router();

//FOR REGISTRATION
exports.signupUser=async(req,res)=>{
    try{
      const {name,email,password}=req.body;
      const userExist=await user.findOne({email})
      if(userExist){
        return res.status(400).json({Message:"User already exists"});
      }
      const hashedPassword=await bcrypt.hash(password,10);
     const newuser=new user({name,email,password:hashedPassword})
      await newuser.save();
      res.status(200).json(responseModel({
        statusCode:200,success:true,
        data:newuser,
        message:"Registration done successfully",
        documents:user.length
      }))
    }
    catch(err){
        res.status(400).json({Error:err.message});
    }
};

//FOR LOGIN
exports.userLogin=async(req,res)=>{
    try{
    const{email,password}=req.body;
    const users=await user.findOne({email})
    if(!users){
       return res.status(400).json({Message:"User not found"});
    }
    // compare password
    const isMatch=await bcrypt.compare(password,users.password)
    if(!isMatch){
        return res.status(400).json({Message:"password error"})
    }
    const token=jwt.sign({userId:users._id},process.env.JWT_SECRET,{expiresIn:"1h"});
    res.status(200).json(responseModel({
        statusCode:200,
        success:true,
        data:token,
        message:"Login successfully",
        documents:1
    }))
    }
    catch(err){
        res.status(400).json({Error:err.message});
    }
};

//POST USERS
exports.postUser=async(req,res)=>{
    try{
        const userPost=new user(req.body);
        await userPost.save();
        res.status(201).json(responseModel({
            statusCode:201,
            success:true,
            data:userPost,
            message:"User post successfully",
            documents:1
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//GET ALL USERS DATA

exports.getUser=async(req,res)=>{
    try{
        //pagination
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||2;
        const skip=(page-1)*limit;
         //Filtering
        const filter={};
       if(req.query.name){
        filter.name={$regex:req.query.name,$options:"i"};
       }
        //sorting
        const sortField=req.query.sortBy || 'createdAt' ;
        const sortOrder=req.query.order =='desc'? -1:1;
        const total=await user.countDocuments(filter);
        const userGet=await user.find(filter).skip(skip).limit(limit).sort({[sortField]:sortOrder});
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:{page,limit,total,totalpage:Math.ceil(total/limit),userGet},
            message:"Get all users data successfully",
            documents:userGet.length
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//GET USERS BY ID
exports.getSpcificUser=async(req,res)=>{
    try{
        const specificUser=await user.findById(req.params.id,req.bode,{new:true});
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:specificUser,
            message:"Get specific user data successfully",
            documents:1
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}


//Get all streams of a user by user id
exports.streamUser=async(req,res)=>{
    try{
     const userStream=await stream.findById({  user:req.params.id});
     res.status(200).json(responseModel({
        statusCode:200,
        success:true,
        data:userStream,
        message:"Get all streams of a user by user_id successfully",
        documents:1
     }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

// Get episodes of all streams of a user by user id
exports.userEpisode=async(req,res)=>{
    try{
       const streamList=await stream.find({user:req.params.id});
       const stream_id=streamList.map(list=>{list._id});
       const episode=await episode.find({stream:{$in:stream_id}})
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:episode,
            message:"Get episodes of all streams of a user by user_id successfully",
            documents:1
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//Update a user by id
exports.updateUser=async(req,res)=>{
    try{
        const userUpdate=await user.findByIdAndUpdate(req.params.id,req.body,{new:true});
         res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:userUpdate,
            message:"Update user data successfully",
            documents:1
        }))
    }
     catch(error){
        res.status(400).json({error:error.message});
    }
}

//Delete User BY ID
exports.deleteUser=async(req,res)=>{
    try{
        const userDelete=await user.findByIdAndDelete(req.params.id);
         res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:userDelete,
            message:"Delete user data successfully",
            documents:1
        }))
    }
     catch(error){
        res.status(400).json({error:error.message});
    }
}