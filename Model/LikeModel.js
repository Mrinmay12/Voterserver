import mongoose from "mongoose";
const Schema=mongoose.Schema

const likeSchema = new Schema({
    image1: {
      type: [String],
      default: [],
    },
    image2: {
      type: [String],
      default: [],
    },
like_id:{
type:String
},
user_id:{
type:String
}
  });

  const LikePost = mongoose.model('LikePost', likeSchema);
  export default LikePost