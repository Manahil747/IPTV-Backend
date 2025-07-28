const express=require("express");
const router=express.Router();
const responseModel=require("../utils/responseModel");
const user=require("../models/user");
const {OAuth2Client}=require("google-auth-library");
const client=new OAuth2Client("672410135528-c5conosne666rnr0p05954egno4920t8.apps.googleusercontent.com");

router.post("/google-login",async(req,res)=>{
    const{token}=req.body;
    try{
        //tokenverify
        const ticket=await client.verifyIdToken({
                idToken:token,
                audience:"672410135528-c5conosne666rnr0p05954egno4920t8.apps.googleusercontent.com"
        });
        const payload=ticket.getPayload();
        const{name,email,picture}=payload;
        
        const User=await user.findOne({email});
        if(!User){
          const User=new user({name,email,picture});        
            await User.save();
        }
        const fullName=User.name || "";
        const[first_name, last_name]=fullName.split(" ");
        res.status(200).json(responseModel({
            statusCode:200,
            sucess:true,
            data:payload,
            message:"Login Successfully",
            documents:1
        }));
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
});
module.exports=router;