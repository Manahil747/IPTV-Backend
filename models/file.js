const mongoose=require("mongoose");
const fileSchema=new mongoose.Schema({
    original_name:{type:String,required:true},
    current_name:{type:String,required:true},
    type:{type:String,required:true},
    path:{type:String,required:true},
    size:{type:String,required:true}
},{timestamps:true})
module.exports=mongoose.model("file",fileSchema);
