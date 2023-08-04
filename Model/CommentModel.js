import mongoose from "mongoose";
import moment from "moment";
const Schema = mongoose.Schema

const commentSchema = new Schema({
    commentArray: [{
            user_id:String,
            comment_des:String,
            uploadTime: { type: Date, default: Date.now },
        }],
    post_id: {
        type: String    //Post id is comment id 
    },
    createdAt: {
        type: Date,
        default: Date.now
      },
     
});

const CommentPost = mongoose.model('CommentSection', commentSchema);
export default CommentPost