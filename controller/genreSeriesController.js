const express=require("express");
const router=express.Router();
const genreSeries=require("../models/genreSeries");
const {genreSeriesPost,getgenreSeries}=require("../routes/genreSeriesRoute");

router.post("/genreSeries",genreSeriesPost);
router.get("/genreSeries",getgenreSeries);

module.exports=router;