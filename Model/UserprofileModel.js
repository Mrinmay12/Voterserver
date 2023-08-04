import mongoose from "mongoose";
const Schema=mongoose.Schema

const imageUploadSchema = new Schema({

  user_id: String,

  profileImage: String,

  });
  
  // Create the image upload model
  const ProfileImageUpload = mongoose.model('ProfileImage', imageUploadSchema);
  export default ProfileImageUpload