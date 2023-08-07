import Post from "../Model/UploadPost.js";
import User from "../Model/UserModel.js";
import { generateId } from "../Utiles.js";
import sharp from "sharp";
import moment from "moment";
export const UserPost = async (req, res) => {
  try {
    const { user_id,post_discription,status } = req.body;
    // Create a new image document
    const image = new Post();
    let id = generateId()
    // Get the uploaded images from the request
    const image1 = req.files['image1'][0];
    const image2 = req.files['image2'][0];

    // Resize and process image1
    const processedImage1 = await sharp(image1.buffer)
      .resize(800) // Set the desired width (800 pixels in this example)
      .toBuffer();

    // Set image1 data and content type
    image.image1.data = processedImage1;
    image.image1.contentType = image1.mimetype;
    image.image1.image_likes = [];
    image.image1.image_id = "Image1" + id+".png"

    // Resize and process image2
    const processedImage2 = await sharp(image2.buffer)
      .resize(800) // Set the desired width (800 pixels in this example)
      .toBuffer();
    // Set image2 data and content type
    image.image2.data = processedImage2;
    image.image2.contentType = image2.mimetype;
    image.image2.image_id = "Image2" + id+".png"
    image.user_id = user_id;
    image.image2.image_likes = [];
    image.image_id = id;
    image.post_discription = post_discription;
    image.status = status;

    // Save the image to the database
    await image.save();

    res.send('Images uploaded successfully');
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).send('An error occurred');
  }


}

const deleteOldPosts = async () => {
  try {
    const Time = moment().subtract(24, 'hours');
    await Post.deleteMany({ status: true, createdAt: { $lt: Time } });
    console.log('Old posts deleted successfully.');
  } catch (error) {
    console.error('Error deleting old posts:', error);
  }
};

// Schedule the cleanup function to run every minute (adjust the interval as needed)
setInterval(deleteOldPosts, 86400000);

export const GetPost = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;  //offset  change only for next page offset will 5 
    // const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPosts = await Post.countDocuments();
    const hasMore = endIndex < totalPosts;
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    };
    const images = await Post.find().sort({ createdAt: -1 }) .skip(startIndex).limit(limit);
    const users= await User.find({})
    const imageLinks = images.map((image) => {
        //comment post time  start code 
        const currentTime = moment();
        const uploadTime = moment(image.createdAt);
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
      let perticularuser=users.filter((item)=>item.user_id===image.user_id)[0]
      const image1Link = `https://voterserver.onrender.com/api/userpost/images/${image.image1.image_id}`;
      const image2Link = `https://voterserver.onrender.com/api/userpost/images/${image.image2.image_id}`;
      return {
        image1: image1Link,
        image1_id:image.image1.image_id,
        image2_id:image.image2.image_id,
        image2: image2Link,
        user_id: image.user_id,
        username:perticularuser?.name,
        post_id:image._id,
        post_time:formattedTime,
        post_des:image.post_description


      };
    });
    // res.set('Content-Type', images.contentType);

    res.send({
      totalPosts,
      pagination,
      posts: imageLinks,
      hasMore
    });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).send('An error occurred');
  }
}

export const PerticulerImg = async (req, res) => {
  try{
  let imageid = req.params.id
  // console.log(id,"idididid");
  let postdata = await Post.find({})
  //   console.log(postdata);
  let image1 = postdata.filter((item) => item.image1.image_id === imageid)[0]?.image1
  let image2 = postdata.filter((item) => item.image2.image_id === imageid)[0]?.image2
  let imagedata;
  let contentType;

  if (image1 !== undefined) {
    imagedata = image1.data;
    contentType = image1.contentType
  } else if (image2 !== undefined) {
    imagedata = image2.data;
    contentType = image2.contentType
  } else {
    imagedata = null;
    contentType = null
  }
 
  if (imagedata === null) {
    return res.status(404).send({ message: "Image not found", status: false });
  } else {

    res.set('Content-Type', contentType);
    res.send(imagedata);
  }

} catch (error) {
  console.error('Error retrieving image:', error);
  res.status(500).send('An error occurred');
}
 

}

export const PostLike=async (req,res)=>{
  try {
    let {post_id} = req.query
    let {image1_id,image2_id,user_id} = req.query
    // let {image2_id} = req.query
    // console.log(id,"idididid");
    let postdata = await Post.findOne({_id:post_id})
    if(image1_id !==""){
      if(!postdata.image1.image_likes.includes(user_id)){
        const updatedDataArray =  [...new Set([...postdata.image1.image_likes,user_id])]
        postdata.image1.image_likes = updatedDataArray;
        let data=postdata.image2.image_likes.filter(item=>item !==user_id)
        const updatedDataArray2 = data
        postdata.image2.image_likes = updatedDataArray2;
        await postdata.save();
        res.status(200).send('Like updated successfully');
      }else{
        let data=postdata.image1.image_likes.filter(item=>item !==user_id)
        const updatedDataArray = data
        postdata.image1.image_likes = updatedDataArray;
        await postdata.save();
        // res.status(200).send('Data updated successfully');
        res.json({
          message:"Like updated successfully",
          num_like:postdata.image1.image_likes.length
        })
      }
    }else{
    if(!postdata.image2.image_likes.includes(user_id)){
          const updatedDataArray =  [...new Set([...postdata.image2.image_likes,user_id])]
          postdata.image2.image_likes = updatedDataArray;
          let data=postdata.image1.image_likes.filter(item=>item !==user_id)
          const updatedDataArray2 = data
          postdata.image1.image_likes = updatedDataArray2;
          await postdata.save();
          res.status(200).send('Like updated successfully');
        }else{
          let data=postdata.image2.image_likes.filter(item=>item !==user_id)
          const updatedDataArray = data
          postdata.image2.image_likes = updatedDataArray;
          await postdata.save();
          // res.status(200).send('Data updated successfully');
          res.json({
            message:"Like updated successfully",
            num_like:postdata.image2.image_likes.length
          })
        }
      
    }
    // res.json(postdata)
    // console.log(postdata);
    //   console.log(postdata);
    // let image1 = postdata.filter((item) => item.image1.image_id === imageid)[0]?.image1
    // let image2 = postdata.filter((item) => item.image2.image_id === imageid)[0]?.image2

      // if (!doc) {
      //   // No document exists, create a new one
      //   const data = new LikePost({ dataArray:[user_id],like_id:like_id });
      //   await data.save();
      //   res.status(201).send('Data added successfully');
      // } 
   
      // else {

      //   if(!doc.dataArray.includes(user_id)){
      //     const updatedDataArray =  [...new Set([...doc.dataArray,user_id])]
      //     doc.dataArray = updatedDataArray;
      //     await doc.save();
      //     res.status(200).send('Like updated successfully');
      //   }else{
      //     let data=doc.dataArray.filter(item=>item !==user_id)
      //     const updatedDataArray = data
      //     doc.dataArray = updatedDataArray;
      //     await doc.save();
      //     // res.status(200).send('Data updated successfully');
      //     res.json({
      //       message:"Like updated successfully",
      //       num_like:doc.dataArray.length
      //     })
      //   }
      // }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }

}

export const FlageUpdate=async(req,res)=>{
  try {
    let {post_id,status} = req.query
  let data=  await Post.findOne({_id:post_id})
  data.status=status
  await data.save()
  res.json({
    message:"status updated successfully",
    status:true
  })
  }catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
}

export const CreatNewPost=async(req,res)=>{
  try {
    // Extract image data and other information from the request
    const {  user_id, status, post_description } = req.body;
     const image1 = req.files['image1'][0];
    const image2 = req.files['image2'][0];
    // Create a new document using the Mongoose model
    const newPost = new Post({
      image1: {
        data: image1.buffer,
        contentType: image1.mimetype,
        image_id: image1.originalname,
        image_likes: [],
      },
      image2: {
        data: image2.buffer,
        contentType: image2.mimetype,
        image_id: image2.originalname,
        image_likes: [],
      },
      user_id,
      status,
      post_description,
    });

    // Save the document to the database
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const Image_get=async(req,res)=>{
  try {
    const postId = req.params.id;
    let postdata = await Post.find({})
    //   console.log(postdata);
    let image1 = postdata.filter((item) => item.image1.image_id === imageid)[0]?.image1
    let image2 = postdata.filter((item) => item.image2.image_id === imageid)[0]?.image2
    let imagedata;
    // Find the post by ID from the database
    // const post = await Post.findById(postId);

    // Check if the post exists and has an image
    if ( image1 || image2) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Serve the image data
    if (req.query.image === 'image1') {
      res.contentType(image1.contentType); 
      res.send(image1.data);
    } else if (req.query.image === 'image2') {
      res.contentType(image2.contentType);
      res.send(image2.data);
    } else {
      res.status(400).json({ error: 'Invalid image parameter' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
