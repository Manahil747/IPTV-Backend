const express=require("express");
const router=express.Router();
const upload = require("../upload/upload"); 

const{postEpisode,getEpisode,getEpisodeById,episodeSeason,updateEpisode,deleteEpisode}=require("../routes/episodeRoutes");
router.post("/episode",upload.single("file"),postEpisode);
router.get("/episode",getEpisode);
router.get("/episode/:id",getEpisodeById);
router.get("/episode/:id/streams",episodeSeason);
router.put("/episode/:id",updateEpisode);
router.delete("/episode/:id",deleteEpisode);
module.exports=router;