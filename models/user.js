const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    first_name:{type:String,required:false},
    last_name:{type:String,required:false},
    name:{type:String,required:false},
    email:{type:String,unique:true,required:true},
    password:{type:String},
    picture:{type:String}
},
{timestamps:true});
module.exports=mongoose.model("user",userSchema);