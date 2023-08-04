import LikePost from "../Model/LikeModel.js";

export const Like=async (req,res)=>{
    try {
        const {image_position} =req.body;
        const{like_id}=req.body;
        const{user_id}=req.body;
        const doc = await LikePost.findOne({like_id:like_id});
if(image_position===1){
  if (!doc) {
    // No document exists, create a new one
    const data = new LikePost({ image1:[user_id],like_id:like_id });
    await data.save();
    res.status(201).send('Like added successfully');
  } 

  else {
if(doc.image2.includes(user_id)){
  let data=doc.image2.filter(item=>item !==user_id)
      const updatedDataArray = data
      doc.image2 = updatedDataArray;
      await doc.save();
}

  if(!doc.image1.includes(user_id)){
    const updatedDataArray =  [...new Set([...doc.image1,user_id])]
    doc.image1 = updatedDataArray;
    await doc.save();
    res.status(200).send('Like updated successfully');
  }else{
    let data=doc.image1.filter(item=>item !==user_id)
    const updatedDataArray = data
    doc.image1 = updatedDataArray;
    await doc.save();
    // res.status(200).send('Data updated successfully');
    res.json({
      message:"Like updated successfully",
      num_like:doc.image1.length
    })
  }

  }
}else{

  if (!doc) {
    // No document exists, create a new one
    const data = new LikePost({ image2:[user_id],like_id:like_id });
    await data.save();
    res.status(201).send('Like added successfully');
  } 

  else {
    if(doc.image1.includes(user_id)){
      let data=doc.image1.filter(item=>item !==user_id)
          const updatedDataArray = data
          doc.image1 = updatedDataArray;
          await doc.save();
    }
    if(!doc.image2.includes(user_id)){
      const updatedDataArray =  [...new Set([...doc.image2,user_id])]
      doc.image2 = updatedDataArray;
      await doc.save();
      res.status(200).send('Like updated successfully');
    }else{
      let data=doc.image2.filter(item=>item !==user_id)
      const updatedDataArray = data
      doc.image2 = updatedDataArray;
      await doc.save();
      // res.status(200).send('Data updated successfully');
      res.json({
        message:"Like updated successfully",
        num_like:doc.image2.length
      })
    }
  
  }
}
      } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
      }
  
}

export const PerticularUserLike=async(req,res)=>{
  const {like_id}=req.query
  const{user_id}=req.query;
  // const doc = await LikePost.findOne({like_id:like_id});
  // let like=doc.dataArray
  const doc = await LikePost.findOne({like_id:like_id});
  if(doc){
    let like=doc.image1
    let uselike_or_not=like.includes(user_id)
    let like2=doc.image2
    let uselike_or_not2=like2.includes(user_id)
    console.log(uselike_or_not);
    res.json({
      message:"List of like",
      num_like:like.length,
      num_like2:like2.length,
      user_like:uselike_or_not,
      user_like2:uselike_or_not2
    })
  }else{
    res.json({
      message:"post not ",})
  }
 


}