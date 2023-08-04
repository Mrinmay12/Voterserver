import { Commentadd ,GetAllComment} from "../Controllers/CommentController.js";
import express from "express";
const router=express.Router()
router.post('/comment',Commentadd);
router.get('/getcomments',GetAllComment);
export default router