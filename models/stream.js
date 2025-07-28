const mongoose=require("mongoose");
const streamSchema=new mongoose.Schema({
   episode_id:{type:mongoose.Schema.Types.ObjectId, ref:"episode"},
   user_id:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
   time:{type:String,required:true}
},{timestamps:true})
module.exports=mongoose.model("stream",streamSchema);