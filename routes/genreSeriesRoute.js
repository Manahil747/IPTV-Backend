const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const genreSeries=require("../models/genreSeries");
const responseModel=require("../utils/responseModel");
const genre = require("../models/genre");

//POST 
exports.genreSeriesPost=async(req,res)=>{
try{
    const links=new genreSeries(req.body);
    await links.save();
    res.status(201).json(responseModel({
        statusCode:201,
        success:true,
        data:links,
        message:"Link done",
        documents:1
    }))}
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//GET USING POPULATE(_)
exports.getgenreSeries=async(req,res)=>{
    try{
    const gs=await genreSeries.find()
    .populate("genre_id")
    .populate("series_id");
    res.status(200).json(responseModel({
        statusCode:200,
        success:true,
        data:gs,
        message:"Get data successfully",
        documents:1
    }))
    }
    catch(err){
        res.status(400).json({Error:err.message});
    }
}
