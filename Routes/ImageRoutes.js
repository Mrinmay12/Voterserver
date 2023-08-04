import express from "express";
import {uploadImage,updateImage,GetImg,DeletProfile,UploadProfilePic,updateUserImage} from "../Controllers/ImageController.js";
import multer from "multer";
// const upload = multer({ dest: 'uploads/' })
// const upload = multer.memoryStorage();
const storage = multer.memoryStorage();

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });
const router=express.Router()

router.post('/upload',upload.single('image'),uploadImage);
router.put('/updateProfilePic/:user_id', upload.single('image'),updateImage)
// router.put('/uploaduserProfilePic',upload.single('profileImage'),updateUserImage)

router.put('/uploadpic/:user_id', upload.single('image'),UploadProfilePic)
// router.get('/image/:id',GetImg)
router.get('/image/:image_id',GetImg)
// router.post('/upload',upload.single('image'),uploadImage);

router.post('/image/delete',DeletProfile)

 export default router

 