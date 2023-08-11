import express from "express";
import { Creatuser,Login,Resetpassword,Forgetpassword,UpdateUser,AdvenceSearch ,UserVerify
    ,verifyToken} from "../Controllers/UserController.js";
const router=express.Router()
 router.post("/newuser",Creatuser)
 router.post("/login",Login)
 router.post("/resetpassword",Resetpassword)
 router.post("/forgetpassword",Forgetpassword)
 router.post("/updateuser",UpdateUser)
 router.get("/searchuser",AdvenceSearch)
 router.get("/verify",verifyToken,UserVerify)



 export default router

 