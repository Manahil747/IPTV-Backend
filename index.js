const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors=require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const port=process.env.PORT || 3000;
const user=require("./controller/userController");
const stream=require("./controller/streamController");  
const season=require("./controller/seasonController");
const genre=require("./controller/genreController");
// const file=require("./controller/fileController");
const episode=require("./controller/episodeController");
const series=require("./controller/seriesController");
const genreSeries=require("./controller/genreSeriesController");
const auth=require("./routes/auth");

app.use("/api",auth);
app.use("/api",user);
app.use("/api",stream);
app.use("/api",season);
app.use("/api",genre);
app.use("/api",episode);
app.use("/api",series);
// app.use("/api",file);
app.use("/api",genreSeries);


//MONGODB CONNECTION
console.log("Connecting to:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() =>
    console.log("Connected successfully"))
.catch(err =>
    console.log(err));

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})

//  "getgenre": [
//             {
//                 "_id": "687e250d899aa6209524a42a",
//                 "name": "Action",
//                 "__v": 0
//             },
//             {
//                 "_id": "687e251a899aa6209524a42c",
//                 "name": "Comedy",
//                 "__v": 0
//             }
//         ]