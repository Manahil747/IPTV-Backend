const express=require("express");
const router=express.Router();
const genre=require("../routes/genreRoutes");
const {
  postGenreData,
  getAllGenreData,
  getGenreDataById,
  seriesByGenreId,
  genreIdSeriesSeason,
  UpdateGenreData,
  deleteGenreData
} = require("../routes/genreRoutes");

router.post("/genre", postGenreData);
router.get("/genre", getAllGenreData);
router.get("/genre/:id", getGenreDataById);
router.get("/genre/:id/series", seriesByGenreId);
router.get("/genre/:id/series/seasons", genreIdSeriesSeason);
router.put("/genre/:id", UpdateGenreData);
router.delete("/genre/:id", deleteGenreData);
module.exports=router;