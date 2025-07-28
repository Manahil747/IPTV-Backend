const express=require("express");
const mongoose=require("mongoose");
const genre=require("../models/genre");
const genreSeries = require("../models/genreSeries");
const season=require("../models/season");
const series=require("../models/series");
const responseModel = require("../utils/responseModel");

//POST GENRE
exports.postGenreData=async(req,res)=>{
    try{
    const newGenre= new genre(req.body);
    await newGenre.save();
    res.status(200).json(responseModel({
        statusCode:200,
        success:true,
        data:newGenre,
        message:"Successfullt post",
        documents:1
    }))}
    catch(err){
        res.status(400).json({error:err.message});
    }
}

//GET ALL GENRE
exports.getAllGenreData=async(req,res)=>{
    try{
         //pagination
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||2;
        const skip=(page-1)*limit;
        //filtering
        const filter={};
       if(req.query.name){
        filter.name={$regex:req.query.name,$options:"i"};
       }
        const total=await genre.countDocuments(filter);
        //sortiing
        const sortField=req.query.sortBy||'createdAt';
        const sortOrder=req.query.order =='desc'?-1:1;
   const getgenre= await genre.find(filter).limit(limit).skip(skip).sort({[sortField]:sortOrder});
   res.status(200).json(responseModel({
    statusCode:200,
    success:true,
    data:{page,limit,total,totalPage:Math.ceil(total/limit),getgenre},
    message:"Successfully get all genre",
    documents:getgenre.length
   }))
    }
    catch(err){
        res.status(400).json({Error:err.message});
    }
}

//GET A GENRE BY ID
exports.getGenreDataById=async(req,res)=>{
    try{
    const getSpecificGenre=await genre.findById(req.params.id);
    res.status(200).json(responseModel({
        statusCode:200,
        success:true,
        data:getSpecificGenre,
        message:"Successfully get",
        documents:getSpecificGenre.length
    }))
    }
    catch(err){
        res.status(400).json({err:err.message});
    }

};

//Get Genre/:id/Series

exports.seriesByGenreId=async(req,res)=>{
    try{
        const genre_id=req.params.id;
        const seriesByGenre=await genre.aggregate([
             {
                $match:{
                    _id:new mongoose.Types.ObjectId(genre_id)
                }
            },
            {
                $lookup:{
                    from:"genreseries",
                    localField:"_id",
                    foreignField:"genre_id",
                    as:"genreSeries"
                }
            },
            {
                $unwind:"$genreSeries"
            },
            {
                $lookup:{
                    from:"series",
                    localField:"genreSeries.series_id",
                    foreignField:"_id",
                    as:"series"
                }
            },
            {
                $unwind:"$series"
            },
            {
                $project:{
                    series_name:"$series.name",
                    series_description:"$series.description",
                    series_thumbnail_id:"$series.thumbnail_id",
                    series_trailer_id:"$series.trailer_id"
                }
            }
        ]);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:seriesByGenre,
            message:"Successfully get SeriesByGenre",
            documents:series.length
        }))
    }
    catch(err){
        res.status(400).json({Error:err.message});
    }
}

//GET /genres/:id/series/seasons

exports.genreIdSeriesSeason=async(req,res)=>{
    try{
        const genre_id=req.params.id;
        const seasonData=await genre.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(genre_id)
                }
            },
            {
                $lookup:{
                    from:"genreseries",
                    localField:"_id",
                    foreignField:"genre_id",
                    as:"genreSeries"
                }
            },
            {
                $unwind:"$genreSeries"
            },
            {
                $lookup:{
                    from:"series",
                    localField:"genreSeries.series_id",
                    foreignField:"_id",
                    as:"series"
                }
            },
            {
                $unwind:"$series"
            },
            {
                $lookup:{
                    from:"seasons",
                    localField:"series._id",
                    foreignField:"series_id",
                    as:"season"
                }
            },
              {$unwind:"$season"},
            {
                $project:{
                    season_name:"$season.name",
                    season_description:"$season.description",
                    season_series_id:"$season.series_id"
                }
            }
        ]);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:seasonData,
            message:"Successfully get seasons of series",
            documents:seasonData.length
        }))
    }
    catch(error){
        res.status(400).json({Error:error.message});
    }
}

//UPDATE GENRE
exports.UpdateGenreData=async(req,res)=>{
   try{
    const updateGenre=await genre.findByIdAndUpdate(req.params.id,req.body,{name:true});
    if(!updateGenre){
        res.status(400).json({Message:"Genre not found"});
    }
    res.status(200).json(responseModel({
        statusCode:200,
        success:true,
        data:updateGenre,
        message:"Genry data updated successfully",
        documents:1
    }))
   }
   catch(err){
    res.status(400).json({Error:err.message});
   }
}

//DELETE GENRE
exports.deleteGenreData=async(req,res)=>{
    try{
        const deleteGenre=await genre.findByIdAndDelete(req.params.id);
        if(!deleteGenre){
            res.status(400).json({Message:"Genre not deleted"})
        }
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:deleteGenre,
            message:"Deleted successfully",
            documents:deleteGenre.length
        }))
    }
    catch(err){
        res.status(400).json({Error:err.message});
    }
};

