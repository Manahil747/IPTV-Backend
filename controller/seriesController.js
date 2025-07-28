const express=require("express");
const router=express.Router();
const upload=require("../upload/upload");

const {postSeries,
    getSeries,
    getSeriesById,
    getSeriesSeason,
    seasonepisodes,
    updateSeries,
    deleteSeries
}
=require("../routes/seriesRoutes");

router.post("/series",upload.array("file",2),postSeries);
router.get("/series",getSeries);
router.get("/series/:id",getSeriesById);
router.get("/series/:id/seasons",getSeriesSeason);
router.get("/series/:id/season/episode",seasonepisodes);
router.put("/series/:id",updateSeries);
router.delete("/series/:id",deleteSeries)

module.exports=router;