const express=require("express");
const mongoose=require("mongoose");
const file=require("../models/file");
const responseModel=require("../utils/responseModel");


//UPLOAD File
// exports.postFile= async (req, res) => {
//   try {
//     const fileData = new file({
//       original_name: req.file.originalname,
//       current_name: req.file.filename,
//       type: req.file.mimetype,
//       path: req.file.path,
//       size: `${(req.file.size / 1024).toFixed(2)} KB`

//     });
//     console.log(req.file); 
//     await fileData.save();
//     res.status(201).json(responseModel({
//         statusCode:201,
//         success:true,
//         data:fileData,
//         message:'File uploaded successfully',
//         documents:1   
//      }))

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

//Get File data

exports.getFile=async(req,res)=>{
    try{
        const fileGet=await file.find();
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:fileGet,
            message:"Get file successfully",
            documents:fileGet.length
        }))
    }
     catch(error){
        res.status(400).json({error:error.message});
    }
}

//Update file data
exports.updateFile=async(req,res)=>{
    try{
        const fileUpdate=await file.findByIdAndUpdate(req.params.id,req.body,{new:true});
         res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:fileUpdate,
            message:"Update file successfully",
            documents:1
        }))
    }
     catch(error){
        res.status(400).json({error:error.message});
    }
}

//Delete file data
exports.deleteFile=async(req,res)=>{
    try{
        const fileDelete=await file.findByIdAndDelete(req.params.id);
        res.status(200).json(responseModel({
            statusCode:200,
            success:true,
            data:fileDelete,
            message:"Delete file successfully",
            documents:1
        }))
    }
      catch(error){
        res.status(400).json({error:error.message});
    }
}

    