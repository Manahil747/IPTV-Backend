const express=require("express");
const router=express.Router();

const {
    postStream,
    getStream,
    getSpecificStream,
    getStreamEpisode,
    streamUser,
    seasonEpisode,
    seriesSeason,
    genreSeriess,
    updateStream,
    deleteStream}
=require("../routes/streamRoutes");

router.post("/streams",postStream);
router.get("/streams",getStream);
router.get("/streams/:id",getSpecificStream);
router.get("/streams/:id/episode",getStreamEpisode);
router.get("/streams/:id/user",streamUser);
router.get("/streams/:id/episode/season",seasonEpisode);
router.get("/streams/:id/episode/season/series",seriesSeason);
router.get("/streams/:id/episode/season/series/genre",genreSeriess);
router.put("/streams/:id",updateStream);
router.delete("/streams/:id",deleteStream);

module.exports=router;
