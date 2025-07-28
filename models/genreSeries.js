const mongoose=require("mongoose");
const genre=require("./genre");
const series=require("./series");
const genreSeriesSchema=new mongoose.Schema({
    genre_id:{type:mongoose.Schema.Types.ObjectId,ref:"genre" ,required:true},
    series_id:{type:mongoose.Schema.Types.ObjectId, ref:"series", required:true}
},{timestamps:true});
module.exports=mongoose.model("genreSeries",genreSeriesSchema);