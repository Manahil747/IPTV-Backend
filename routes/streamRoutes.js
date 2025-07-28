const express=require("express");
const mongoose=require("mongoose");
const episode=require("../models/episode");
const series=require("../models/series");
const users=require("../models/user");
const genre=require("../models/genre");
const responseModel = require("../utils/responseModel");
const stream = require("../models/stream");

//POST STREAM
exports.postStream=async(req,res)=>{
    try{
        const streamPost=new stream(req.body);
        await streamPost.save();
        res.status(201).json(responseModel({
            statusCode:201,
            succcess:true,
            data:streamPost,
            message:"Stream data post successfully",
            documents:1
        })) 
}
catch(error){
    res.status(400).json({Error:error.message});
}}

//GET ALL STREAMS
exports.getStream=async(req,res)=>{
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
        //sorting
        const sortField=req.query.sortBy || createdAt;
        const sortOrder=req.query.order =='desc'? -1:1;
        const total=await stream.countDocuments(filter);
        const streamGet=await stream.find(filter).skip(skip).limit(limit).sort({[sortField]:sortOrder});
         res.status(200).json(responseModel({
            statusCode:200,
            succcess:true,
            data:{page,limit,total,totalPage:Math.ceil(total/limit),streamGet},
            message:"Stream data get successfully",
            documents:streamGet.length
        })) 
    }
    catch(error){
         res.status(400).json({Error:error.message});
    }
}

//GET A STREAM BY ID
exports.getSpecificStream=async(req,res)=>{
    try{
        const getaStream=await stream.findById(req.params.id);
           res.status(200).json(responseModel({
            statusCode:200,
            succcess:true,
            data:getaStream,
            message:"Stream data get successfully",
            documents:1
        })) 
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

// Get the episode of a stream by stream id
exports.getStreamEpisode=async(req,res)=>{
    try{
        const stream_id=req.params.id;
        const streamList=await stream.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(stream_id)
                }
            },
            {
                $lookup:{
                    from:"episodes",
                    localField:"episode_id",
                    foreignField:"_id",
                    as:"episode"
                }
            },
            {
                $unwind:"$episode"
            },
          {
            $project:{
                episode_name:"episode.name",
                episode_description:"episode.description",
                episode_thumbnail:"$episode.thumbnail"
            }
          }
        ]);

        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:streamList,
            message:"Get the episode of a stream by stream_id successfully",
            documents:1
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//Get the user of a stream by stream id
exports.streamUser=async(req,res)=>{
    try{
        const stream_id=req.params.id;
        const userList=await stream.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(stream_id)
            },
        },
        {
            $lookup:{
                from:"users",
                localField:"user_id",
                foreignField:"_id",
                as:"user"
            }
        },
        {$unwind:"$user"},
        {
            $project:{
                user_name:"$user.name",
                user_email:"$user.email",
                user_password:"$user.password"
            }
        }
        ]);

        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:userList,
            message:"Get the user of a stream by stream_id successfully",
            documents:1
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//Get the season of an episode of a stream by stream id
exports.seasonEpisode=async(req,res)=>{
    try{
        const stream_id=req.params.id;
        const season=await stream.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(stream_id)
                }
            },
            {
                $lookup:{
                    from:"episodes",
                    localField:"episode_id",
                    foreignField:"_id",
                    as:"episode"
                }
            },
            {
                $unwind:"$episode"
            },
            {
                $lookup:{
                    from:"seasons",
                    localField:"episode.season_id",
                    foreignField:"_id",
                    as:"season"
                }
            },
            {
              $unwind:"$season"
            },
            {
                $project:{
                    season_name:"$season.name",
                    season_description:"$season.description"
                }
            }
        ]);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:season,
            message:"Get the season of an episode of a stream by stream_id successfully",
            documents:1
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

// Get the series of a season of an episode of a stream by stream id
exports.seriesSeason=async(req,res)=>{
    try{
        const stream_id=req.params.id;
        const seriesData=await stream.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(stream_id)
                }
            },
            {
                $lookup:{
                    from:"episodes",
                    localField:"episode_id",
                    foreignField:"_id",
                    as:"episode"
                }
            },
            {
                $unwind:"$episode"
            },
           {
            $lookup:{
                from:"seasons",
                localField:"episode.season_id",
                foreignField:"_id",
                as:"season"
            }
           },
           {
            $unwind:"$season"
           },
           {
            $lookup:{
                from:"series",
                localField:"season.series_id",
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
               series_description:"$series.description"
            }
           }
        ]);
        
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:seriesData,
            message:"Get the series of a season of an episode of a stream by stream_id successfully",
            documents:1
        }))
    }
     catch(error){
        res.status(400).json({error:error.message});
    }
}

//Get the genre of a series of a season of an episode of a stream by stream id
exports.genreSeriess=async(req,res)=>{
    try{
        const stream_id=req.params.id;
        const seriesSeason=await stream.aggregate([
                  {
        $match: {
          _id: new mongoose.Types.ObjectId(stream_id)
        }
      },
      {
        $lookup: {
          from: "episodes",
          localField: "episode_id",
          foreignField: "_id",
          as: "episode"
        }
      },
      { $unwind: "$episode" },
      {
        $lookup: {
          from: "seasons",
          localField: "episode.season_id",
          foreignField: "_id",
          as: "season"
        }
      },
      { $unwind: "$season" },
      {
        $lookup: {
          from: "series",
          localField: "season.series_id",
          foreignField: "_id",
          as: "series"
        }
      },
      { $unwind: "$series" },
      {
        $lookup: {
          from: "genreseries",
          localField: "series._id",  //kunk genreSeries ki id ni cahiya usmy sy series ki id cahiya isss liya series._id use kia
          foreignField: "series_id",
          as: "genreLinks"
        }
      },
      { $unwind: "$genreLinks" },

      {
        $lookup: {
          from: "genres",
          localField: "genreLinks.genre_id",
          foreignField: "_id",
          as: "genre"
        }
      },
      { $unwind: "$genre" },
      {
        $project: {
          _id: 0,
          genre_name: "$genre.name",
          genre_description: "$genre.description",
          stream_title: "$title"
        }
}
        ]);

         res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:seriesSeason,
            message:"Get the genre of a series of a season of an episode of a stream by stream_id successfully",
            document:1
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}


//Update a stream by id
exports.updateStream=async(req,res)=>{
    try{
        const streamUpdate=await stream.findByIdAndUpdate(req.params.id,req,body,{new:true});
        res.status(200).status(responseModel({
            statusCode:200,
            success:true,
            data:streamUpdate,
            message:"Update a stream by id successfully",
            documents:1
        }))
    }
      catch(error){
        res.status(400).json({error:error.message});
    }
}

// Delete a stream by id
exports.deleteStream=async(req,res)=>{
    try{
        const streamDelete=await stream.findByIdAndDelete(req.params.id);
            res.status(200).status(responseModel({
            statusCode:200,
            success:true,
            data:streamDelete,
            message:"Delete a stream by id successfully",
            documents:1
        }))
    }
      catch(error){
        res.status(400).json({error:error.message});
    }
}









