
import sharp from "sharp"
import ImageUpload from "../Model/ImageuplodeModel.js"; // Assuming you have a separate file for the image upload schema/model
import User from "../Model/UserModel.js";
export async function uploadImage(req, res) {
  try {
    const { buffer, mimetype } = req.file;
    const { user_id } = req.body;
    const existingUser = await ImageUpload.findOne({ user_id: user_id });
    if (!existingUser) {
      const resizedImageBuffer = await sharp(buffer)
        .resize(800)
        .toBuffer();
      // Create a new image record
      const image = new ImageUpload({
        data: resizedImageBuffer,
        contentType: mimetype,
        user_id: user_id
      });

      // Save the image to the database
      await image.save();

      res.send('Image uploaded successfully');
    } else {
      // Update the image data and content type
      const resizedImageBuffer = await sharp(buffer)
        .resize(800)
        .toBuffer();
      existingUser.data = resizedImageBuffer;
      existingUser.contentType = mimetype;

      // Save the updated image
      await existingUser.save();

      res.send('Image updated successfully');
      // return res.status(409).json({ error: 'User already exists' });


    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('An error occurred');
  }

}

export async function updateImage(req, res) {
  try {
    const user_id = req.params.user_id;
    const { buffer, mimetype } = req.file;

    // Resize the updated image to a desired width (e.g., 800 pixels)
    const resizedImageBuffer = await sharp(buffer)
      .resize(800)
      .toBuffer();

    // Find the image by ID
    const image = await ImageUpload.findOne({ user_id });

    if (!image) {
      const resizedImageBuffer = await sharp(buffer)
        .resize(800)
        .toBuffer();
      // Create a new image record
      const image = new ImageUpload({
        data: resizedImageBuffer,
        contentType: mimetype,
        user_id: user_id
      });

      // Save the image to the database
      await image.save();

      res.json({message:'Image uploaded successfully',status:false});
    } else {
      // Update the image data and content type
      image.data = resizedImageBuffer;
      image.contentType = mimetype;

      // Save the updated image
      await image.save();

      res.json({message:'Image updated successfully',status:false});
    }


  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).send('An error occurred');

  };

}
export const UploadProfilePic=async(req,res)=>{
  try {
    const image=req.file
    const user_id = req.params.user_id;
    const imageId = await ImageUpload.findOne({ user_id });
    if(!imageId){
      const imagepost = new ImageUpload({
      user_id: user_id,
      data: image.buffer,
      contentType: image.mimetype,
      image_id: image.originalname,
      })
      await imagepost.save();

      res.status(201).json({ message: 'Image created successfully',image_id:image.originalname });
    }else{
      imageId.data=image.buffer,
      imageId.contentType=image.mimetype,
      imageId.user_id=user_id
      imageId.image_id=image.originalname,
      await imageId.save();

      res.json({message:'Image updated successfully',status:false,image_id:image.originalname});
    }
    console.log('====================================');
    console.log(image);
    console.log('====================================');
    
    console.log(user_id)

  }catch(err){
  console.log(err);
}
}
export const updateUserImage=async()=>{
  try {
    // console.log("fdgfgfg")
    const { user_id } = req.params;
    // const profileImage = req.file.buffer.toString('base64');
    // const UserId = await ImageUpload.findOne({ user_id });
    console.log(user_id,"userid")
    console.log(profileImage)
// if(!UserId){
//   const newProfile = new ImageUpload({ user_id, profileImage });
//   await newProfile.save();

//   res.json({ message: 'Profile created successfully' ,status:false});
// }else{
//   UserId.user_id=user_id,
//   UserId.profileImage=profileImage
//   await UserId.save()
//   res.json({ message: 'Profile update successfully',status:false });
// }
   
  } catch (error) {
    // res.status(500).json({ error: 'Something went wrong' });
  }
}
export async function GetImg(req, res) {
  try {
    // const imageId = req.params.id;

    // Find the image by ID
    // const image = await ImageUpload.findById(imageId);
    const user_id = req.params.user_id;
    const image_id = req.params.image_id;
    const image = await ImageUpload.findOne({ image_id});

    if (!image) {
      // return res.status(404).send({ message: "Image not found", status: false });
      return res.json({message: "Image not found", status: false})
    }
    else {
      // Set the appropriate content type header
      res.set('Content-Type', image.contentType);

      // res.send(image.data);
      res.send(image.data);
    }


  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).send('An error occurred');
  }
}


export const DeletProfile = async (req, res) => {
  let { user_id } = req.body
  await ImageUpload.findOneAndDelete({ user_id: user_id }).then((respon) => {
    res.send({ message: "Image delete sucessfull",status:true })
  }).catch(err => { console.log(err) })

}