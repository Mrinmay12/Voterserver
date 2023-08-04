
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./DatabaseConnection/Database.js";
import UserRoutes from "./Routes/UserRoutes.js"
import imageRoutes from "./Routes/ImageRoutes.js"
import PostRoutes from "./Routes/PostRoutes.js"
import LikeRoutes from "./Routes/LikePostRoutes.js"
import CommentRoutes from "./Routes/CommentRoutes.js"
import UserProfileRoutes from "./Routes/UserprofileRoute.js"
dotenv.config()
const app=express()
const PORT=process.env.PORT 
app.use(bodyParser.urlencoded({extended:true}))
// app.use(bodyParser.json())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
// Other middleware and app configurations...

app.use('/images', express.static('path/to/image/directory')); // Assuming you want to serve uploaded images

// Use the image routes
app.use('/api', imageRoutes);

//user routes
app.use("/api/user",UserRoutes)

//user Post routes
app.use("/api/userpost",PostRoutes)

//Like post routes
app.use("/api/userlikes",LikeRoutes)
//Comment routes
app.use("/api/post",CommentRoutes)
app.use("/api/user/UserProfile",UserProfileRoutes)
app.get("/",(req,res)=>{
    res.send("Welcome to myVoterme server")
})
const start =async()=>{
    try{
await connectDB()
app.listen(PORT,()=>{
    console.log("App start "+PORT)

})

    }catch(err){console.log(err)}
}
start()