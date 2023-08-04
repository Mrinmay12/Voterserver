import { Like,PerticularUserLike } from "../Controllers/LikeController.js";
import express from "express";
const router=express.Router()
router.post('/like',Like);
router.get('/userlike',PerticularUserLike);

export default router