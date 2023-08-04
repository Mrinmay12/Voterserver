import mongoose from "mongoose";
const Schema=mongoose.Schema
const UploadPost = Schema({
    image1: {
      data: Buffer,
      contentType: String,
      image_id:String,
      image_likes:[String]
    },
    image2: {
      data: Buffer,
      contentType: String,
      image_id:String,
      image_likes:[String]
    },
    user_id: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    status:Boolean,
    post_description:String
    // image_id:String
  });

  const Post = mongoose.model('UserPost', UploadPost);
  export default Post