const express=require("express");
const mongoose=require("mongoose");
const season=require("../models/season");
const series=require("../models/series");
const episode=require("../models/episode");
const responseModel = require("../utils/responseModel");
const file=require("../models/file");

//POST series
exports.postSeries=async(req,res)=>{
    try{
        const {name,description}=req.body;
        const fileData=req.files.map(file=>({
            original_name:file.originalname,
            current_name:file.filename,
            type:file.mimetype,
            path:file.path,
            size: `${(file.size / 1024).toFixed(2)} KB`
        }));
        const manyFiles=await file.insertMany(fileData);
        //series
    const seriesPost=new series({
        name,
        description,
        thumbnail_id:manyFiles[0]._id,
        trailer_id:manyFiles[1]._id
    })
    await seriesPost.save();
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:{seriesPost,manyFiles},
            message:"Successfully post series",
            documents:1
        }))
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//GET SERIES 
exports.getSeries=async(req,res)=>{
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
        const total=await series.countDocuments(filter);
        //sorting
        const sortField=req.query.sortBy||'createdAt';
        const sortOrder=req.query.order =='desc'?-1:1;
        const seriesGet=await series.find(filter).skip(skip).limit(limit).sort({[sortField]:sortOrder});

          res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:{page,limit,total,totalPage:Math.ceil(total/limit),seriesGet},
            message:"Successfully get series",
            documents:seriesGet.length
        }))
    }
    
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//GET SERIES BY ID
    exports.getSeriesById=async(req,res)=>{
        try{
        const getSpecificSeries=await series.findById(req.params.id);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:getSpecificSeries,
            message:"Successfully get Series",
            documents:getSpecificSeries.length
        }))
        }
        catch(err){
            res.status(400).json({err:err.message});
        }
};

//GET /series/:id/seasons 
//Get all seasons of given series_id
exports.getSeriesSeason=async(req,res)=>{
    try{
        const series_id=req.params.id;
    const seriesSeasons=await series.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(series_id)
            }
        },
        {
            $lookup:{
                from:"seasons",
                localField:"series._id",
                foreignField:"season_id",
                as:"season"
            }
        },
        {
            $unwind:"$season"
        },
        {
            $project:{
                name:1,
                description:1,
                season_name:'$season.name',
              season_description :'$season.description'
            }
        }
    ]);
     res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:seriesSeasons,
            message:"Successfully get Series Seasons",
            documents:seriesSeasons.length
        }))
        }
        catch(err){
            res.status(400).json({err:err.message});
        }
    }

//GET /series/:id/seasons/episodes

exports.seasonepisodes=async(req,res)=>{
    try{
        const series_id=req.params.id;
        const episodeData=await series.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(series_id)
                }
            },
            {
                $lookup:{
                    from:"seasons",
                    localField:"_id",
                    foreignField:"series_id",
                    as:"season"
                }
            },{
                $unwind:"$season"
            },
            {
                $lookup:{
                    from:"episodes",
                    localField:"season._id",
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
                    episode_thumbnail_id:"$episode.thumbnail_id"
                }
            }    
        ]);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:episodeData,
            message:"Successfully get episodes using season_id",
            document:episodeData.length
        }))
    }
    catch(error){
        res.status(400).json({Error:error.message});
    }
}

//PATCH /series/:id 
exports.updateSeries=async(req,res)=>{
    try{
        const series_id=req.params.id;
        const seriesUpdate=await series.findByIdAndUpdate(req.params.id,req.body,{new:true});
         res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:seriesUpdate,
            message:"Successfully update Series",
            documents:1
        }))
        }
        catch(err){
            res.status(400).json({err:err.message});
        }
}
//DELETE SERIES
exports.deleteSeries=async(req,res)=>{
    try{
    const seriesDelete=await series.findByIdAndDelete(req.params.id);
    res.status(200).json(responseModel({
        statusCode:200,
        success:true,
        data:seriesDelete,
        message:"Delete series data successfully",
        documents:1
    }))
    }
    catch(error){
        res.status(400).json({Error:error.message});
    }
}