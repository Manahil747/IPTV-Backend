const mongoose=require("mongoose");
const genreSchema=new mongoose.Schema({
    name:{type:String,unique:true,required:true}
},{timeStamps:true})
module.exports=mongoose.model("genre",genreSchema);