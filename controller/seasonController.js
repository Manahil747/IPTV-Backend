const express=require("express");
const router=express.Router();
const {postSeason,getSeasons,getSeasonById,seasonEpisode,updateSeason,deleteSeason}=require("../routes/seasonRoutes");

router.post("/season",postSeason);
router.get("/season",getSeasons);
router.get("/season/:id",getSeasonById);
router.get("/season/:id/episode",seasonEpisode);
router.put("/season/:id",updateSeason);
router.delete("/season/:id",deleteSeason);
module.exports=router;



