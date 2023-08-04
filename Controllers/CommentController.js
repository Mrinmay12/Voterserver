import CommentPost from "../Model/CommentModel.js";
import User from "../Model/UserModel.js";
import Post from "../Model/UploadPost.js";
import moment from "moment";
export const Commentadd= async(req,res)=>{
    try {
        const{post_id}=req.body;
        const{user_id,comment_des}=req.body;
        const doc = await CommentPost.findOne({post_id:post_id});
    
        if (!doc) {
          // No document exists, create a new one
          const data = new CommentPost({ commentArray:[{user_id:user_id,comment_des:comment_des}],post_id:post_id });
          await data.save();
          res.status(201).send('Comment added successfully');
        } else{
            const updatedDataArray = [...doc.commentArray,{user_id:user_id,comment_des:comment_des}]
            doc.commentArray = updatedDataArray;
            await doc.save();
            res.json({
                message:"Comment added successfully",
              })
        }
    }catch(err){
        res.status(400).send(err)
    }
}


const deletePostWithComments = async (postId) => {
  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      await CommentPost.deleteMany({ post_id: postId });
    }

    // Delete the post
    // const deletedPost = await Post.findByIdAndRemove(postId);

    // Delete the associated comments if they exist
   

    // return deletedPost;
  } catch (error) {
    throw error;
  }
};
export const GetAllComment = async (req, res) => {
    const {post_id}=req.query
    try {
    deletePostWithComments(post_id)

      const comments = await CommentPost.findOne({post_id:post_id}).sort({ createdAt: -1 });
 ;

      const users= await User.find({})
      const allcomment = comments?.commentArray.map((user) => {

        //comment post time  start code 
  
        const currentTime = moment();
        const uploadTime = moment(user.uploadTime);
        const duration = moment.duration(currentTime.diff(uploadTime))
        let formattedTime;
        if (duration.asSeconds() < 60) {
          formattedTime = Math.floor(duration.asSeconds()) + ' seconds ago';
        } else if (duration.asMinutes() < 60) {
          formattedTime = Math.floor(duration.asMinutes()) + ' minutes ago';
        } else if (duration.asHours() < 24) {
          formattedTime = Math.floor(duration.asHours()) + ' hours ago';
        } else if (duration.asDays() < 30) {
          formattedTime = Math.floor(duration.asDays()) + ' days ago';
        } else if (duration.asMonths() < 12) {
          formattedTime = Math.floor(duration.asMonths()) + ' months ago';
        } else {
          formattedTime = Math.floor(duration.asYears()) + ' years ago';
        }
  
        //end code
        let perticularuser=users.filter((item)=>item.user_id===user.user_id)[0]
        return {
       user_profile:`localhost:9000/api/image/${user.user_id}`,
            username:perticularuser.name,
            comment:user.comment_des,
            post_time:formattedTime
        };
      });
      // res.set('Content-Type', images.contentType);
  
      res.send(allcomment);
    } catch (error) {
      console.error('Error retrieving images:', error);
      res.status(500).send('An error occurred');
    }
  }

  
  