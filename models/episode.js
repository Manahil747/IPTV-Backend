const mongoose=require("mongoose");
const file=require("../models/file");
const episodeSchema=new mongoose.Schema({
    season_id:{type:mongoose.Schema.Types.ObjectId, ref:"season"},
    name:{type:String,required:true},
    document:{type:String,required:true},
    thumbnail_id:{type:mongoose.Schema.Types.ObjectId, ref:"file" }

},{timestamps:true})
module.exports=mongoose.model("episode",episodeSchema);