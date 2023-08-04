import ProfileImageUpload from "../Model/UserprofileModel.js"
export const uploadImage=async(req,res)=>{
    try {
    const {profileImage}=req.body
    const {user_id}=req.body

 const imageId = await ProfileImageUpload.findOne({ user_id });
    if(!imageId){
      const imagepost = new ProfileImageUpload({
      user_id: user_id,
      profileImage:profileImage
      })
      await imagepost.save();

      res.status(200).json({ message: 'Image created successfully',status:false });
    }else{
        imageId.user_id=user_id,
        imageId.profileImage=profileImage
        await imageId.save()
        res.status(200).json({ message: 'Image update successfully',status:true });
    }
}catch(err){
    console.log(err)
}
}


export const getUserImage=async(req,res)=>{
    try{
    const {user_id}=req.params
    const imageId = await ProfileImageUpload.findOne({ user_id });
    if(imageId){
        res.json({image:imageId.profileImage})
    }else{
        res.send("No Image Found")
    }
}catch(err){
    console.log(err)
}
}

export const DeletProfile = async (req, res) => {
    let { user_id } = req.body
    await ProfileImageUpload.findOneAndDelete({ user_id: user_id }).then((respon) => {
      res.send({ message: "Image delete sucessfull",status:true })
    }).catch(err => { console.log(err) })
  
  }