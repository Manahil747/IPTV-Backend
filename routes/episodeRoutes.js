const express=require("express");
const mongoose=require("mongoose");
const stream=require("../models/stream");
const episode=require("../models/episode");
const file=require("../models/file");
const responseModel = require("../utils/responseModel");


//POST episode

exports.postEpisode=async(req,res)=>{
        try {
          const{name,document}=req.body;
          const fileData = new file({
            original_name: req.file.originalname,
            current_name: req.file.filename,
            type: req.file.mimetype,
            path: req.file.path,
            size: `${(req.file.size / 1024).toFixed(2)} KB`
          });
          await fileData.save();
      const episodeData=new episode({
            name,
            document,
            thumbnail_id:fileData._id
         })
         await episodeData.save();
         res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:{episodeData,fileData},
            message:"successfully upload file and episode data",
            documents:1
         }))
        } catch(error) {
          res.status(400).json({error: error.message});
        }
    }
//GET ALL EPISODES

exports.getEpisode=async(req,res)=>{
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
       const total=await episode.countDocuments(filter);
       //Sorting
       const sortField=req.query.sortBy||'createdAt';
       const sortOrder=req.query.order =='desc'? -1:1;
        const episodeGet=await episode.find(filter).limit(limit).skip(skip).sort({[sortField]:sortOrder});
          res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:{page,limit,total,totalPage:Math.ceil(total/limit),episodeGet},
            message:"Successfully get episodes",
            documents:episodeGet.length
        }))
    }
    
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//GET EPISODE BY ID

    exports.getEpisodeById=async(req,res)=>{
        try{
        const getSpecificEpisode=await episode.findById(req.params.id);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:getSpecificEpisode,
            message:"Successfully get episode",
            documents:1
        }))
        }
        catch(err){
            res.status(400).json({err:err.message});
        }
};

// GET /episodes/:id/streams

exports.episodeSeason=async(req,res)=>{
    try{
        const episode_id=req.params.id;
        // const streamList=await stream.find({episode_id:episode_id});
          const streamList=await episode.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(episode_id)
                }
            },
            {
                $lookup:{
                    from:"streams",
                    localField:"_id",
                    foreignField:"episode_id",
                    as:"stream"
                }
            },
            {
                $unwind:"$stream"
            },
            {
                $project:{
                   stream_episode_id:"$stream.episode_id",
                   stream_user_id:"$stream.user_id"
                }
            }
          ]);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:streamList,
            message:"Successfully done!",
            documents:streamList.length
        }))
    }
    catch(err){
        res.status(400).json({Error:err.message});
    }
}

// PATCH /episode/:id

exports.updateEpisode=async(req,res)=>{
    try{
        const episodeUpdate=await episode.findByIdAndUpdate(req.params.id,req.body,{new:true});
         res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:episodeUpdate,
            message:"Successfully update episode",
            documents:1
        }))
        }
        catch(err){
            res.status(400).json({err:err.message});
        }
}

// DELETE /episode/:id

exports.deleteEpisode=async(req,res)=>{
    try{
    const episodeDelete=await episode.findByIdAndDelete(req.params.id);
    res.status(200).json(responseModel({
        statusCode:200,
        success:true,
        data:episodeDelete,
        message:"Delete episode data successfully",
        documents:1
    }))
    }
    catch(error){
        res.status(400).json({Error:error.message});
    }
}

