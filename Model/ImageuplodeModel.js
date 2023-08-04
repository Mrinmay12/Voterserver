import mongoose from "mongoose";
const Schema=mongoose.Schema
// Define the image upload schema
const imageUploadSchema = new Schema({
  // filename: String,
  // path: String,
  // size: Number,
  // contentType: String,
  // id:String
  data: Buffer,
      contentType: String,
  user_id: String,
  image_id:String,
  profileImage: String,

  });
  
  // Create the image upload model
  const ImageUpload = mongoose.model('ImageUpload', imageUploadSchema);
  export default ImageUpload