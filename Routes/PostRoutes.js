import express from "express";
import { UserPost,GetPost,PerticulerImg,PostLike,FlageUpdate,CreatNewPost,Image_get } from "../Controllers/PostController.js";
import multer from "multer";
// const upload = multer({ dest: 'uploads/' })
// const upload = multer.memoryStorage();
const storage = multer.memoryStorage();

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });
const router=express.Router()

router.post('/upload',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]),UserPost);
router.get('/getallpost',GetPost)
router.get('/images/:id',PerticulerImg)
router.post('/like',PostLike)
router.put('/update/status',FlageUpdate)
router.post('/newupload', upload.fields([{ name: 'image1' }, { name: 'image2' }]),CreatNewPost)

export default router