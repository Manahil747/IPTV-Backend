const express=require("express");
const router=express.Router();
const authMiddleware=require("../middleware/authMiddleware");
const {
    signupUser,
    userLogin,
    postUser,
    getUser,
    getSpcificUser,
    streamUser,
    userEpisode,
    updateUser,
    deleteUser
}
=require("../routes/userAuthRoute");

router.post("/signup",signupUser);
router.post("/login",userLogin)
router.post("/user",postUser);
router.get("/user",getUser);
router.get("/users/:id",getSpcificUser);
router.get("/users/:id/streams",streamUser);
router.get("/users/:id/streams/episode",userEpisode);
router.put("/users/:id",updateUser);
router.delete("/users/:id",deleteUser);

module.exports=router;