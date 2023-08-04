import express from "express";
const router=express.Router()
import { uploadImage,getUserImage,DeletProfile } from "../Controllers/UserprofileController.js";
router.put('/upload_user_profile',uploadImage);
router.get('/userImage/:user_id',getUserImage);
router.post('/userImage/image/delete',DeletProfile)

export default router