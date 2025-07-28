const mongoose=require("mongoose");

const seriesSchema=new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    trailer_id:{type:mongoose.Schema.Types.ObjectId, ref:"file"},
    thumbnail_id:{type:mongoose.Schema.Types.ObjectId, ref:"file"}
},{timestamps:true})
module.exports=mongoose.model("series",seriesSchema);