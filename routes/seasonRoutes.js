const express=require("express");
const mongoose=require("mongoose");
const season=require("../models/season");
const episode=require("../models/episode");
const responseModel = require("../utils/responseModel");

//POST seasons

exports.postSeason=async(req,res)=>{
    try{
        const seasonPost= new season(req.body);
        await seasonPost.save();
        res.status(201).json(responseModel({
            statusCode:201,
            success:true,
            data:seasonPost,
            message:"Successfully post seasons",
            documents:1
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//GET SEASONS 

exports.getSeasons=async(req,res)=>{
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
        const sortField=req.query.sortBy||'createdAt';
        const sortOrder=req.query.order =='desc'? -1:1;
        const total=await season.countDocuments(filter);
        const seasonGet=await season.find(filter).skip(skip).limit(limit).sort({[sortField]:sortOrder});
          res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:{page,limit,total,totalPage:Math.ceil(total/limit),seasonGet},
            message:"Successfully get seasons",
            documents:seasonGet.length
        }))
    }
    
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//GET SEASONS BY ID

    exports.getSeasonById=async(req,res)=>{
        try{
        const getSpecificSeason=await season.findById(req.params.id);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:getSpecificSeason,
            message:"Successfully get seasons",
            documents:1
        }))
        }
        catch(err){
            res.status(400).json({err:err.message});
        }
};

//GET /seasons/:id/episodes

exports.seasonEpisode=async(req,res)=>{
    try{
        const season_id=req.params.id;
        // const episodeList=await episode.find({season_id});
          const episodeList=await season.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(season_id)
                }
            },
            {
                $lookup:{
                    from:"episodes",
                    localField:"_id",
                    foreignField:"season_id",
                    as:"episode"
                }
            },
            {
                $unwind:"$episode"
            },
            {
                $project:{
                    episode_name:"$episode.name",
                    episode_description:"$episode.description",
                    episode_season_id:"$episode.season_id",
                    episode_thumbnail_id:"$episode.thumbnail_id"
                }
            }
          ]);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:episodeList,
            message:"Successfully get episodes by season_id ",
            documents:episodeList.length
        }))
    }
    catch(err){
        res.status(400).json({Error:err.message});
    }
}

// PATCH /seasons/:id

exports.updateSeason=async(req,res)=>{
    try{
        const seasonUpdate=await season.findByIdAndUpdate(req.params.id,req.body,{new:true});
         res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:seasonUpdate,
            message:"Successfully update seasons",
            documents:1
        }))
        }
        catch(err){
            res.status(400).json({err:err.message});
        }
}

// DELETE /seasons/:id

exports.deleteSeason=async(req,res)=>{
    try{
    const seasonDelete=await season.findByIdAndDelete(req.params.id);
    res.status(200).json(responseModel({
        statusCode:200,
        success:true,
        data:seasonDelete,
        message:"Delete season data successfully",
        documents:1
    }))
    }
    catch(error){
        res.status(400).json({Error:error.message});
    }
}
