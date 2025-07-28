const mongoose=require("mongoose");
const series = require("./series");
const seasonSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    series_id:{type:mongoose.Schema.Types.ObjectId, ref:"series",required:true}
},
{timestamps:true});
module.exports=mongoose.model("season",seasonSchema);