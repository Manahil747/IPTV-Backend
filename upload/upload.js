const multer=require("multer");
const path=require("path");

//MULTER FILE
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'upload')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});
const upload=multer({storage:storage});
module.exports=upload;

























//    cb(null, Date.now().toString() + '-' + file.originalname);