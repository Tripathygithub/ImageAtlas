const Sequelize = require('sequelize');
const sequelize = require('../models/index.js').sequelize;
const {doesUserExist,validateUsernameAndEmail,isValidEmail}=require('../validators/userValidator.js');
const user = require('../models/user.js')(sequelize, Sequelize.DataTypes);
const photo=require('../models/photo.js')(sequelize,Sequelize.DataTypes);
const tag=require('../models/tag.js')(sequelize,Sequelize.DataTypes);
const searchHistory=require('../models/searchHistory.js')(sequelize,Sequelize.DataTypes);
const axios=require('axios');
require('dotenv').config();
const  createNewUser=async(req,res)=>{
    const newUser=req.body; 
    if(await doesUserExist(newUser.email)){
       return res.status(400).json({message :"user already exists"});
    }
    if(validateUsernameAndEmail(newUser.email,newUser.username)){
        return res.json({messagae:"username and email are required"});
    }
    if(isValidEmail(newUser.email)){
        return res.json({message:"invalid email"});
    }
    try{
       const result=await user.create(newUser);
       res.status(200).json({message:"user created successfully",user:result});
       return result;

    }catch(error){
        console.log(error);
        res.status(500).json({error: error.message});
    }

};

const searchImages=async(req,res)=>{
    try{
      const query=req.query.query;
      if(!query){
         return res.status(400).json({message:"query is required"});
      }
      if(!process.env.UNSPLASH_ACCESS_KEY){
        return res.status(500).json({ error: "Server misconfiguration: Unsplash API key is missing!" });
      }
      const response=await axios.get('https://api.unsplash.com/search/photos',{
           params:{
                query:query
           },
           headers:{
               Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
           }
      });
      const photos=[];
      const allImages=response.data.results;
       for(const image of allImages){
        photos.push({
            imageUrl:image.urls.raw,
            description:image.slug,
            altDescription:image.alternative_slugs.en,
        });
    }
       if(photos.length===0)
          return res.status(404).json({message:"no images found for the given query"});
       
        res.status(200).json({photos: photos});
    }catch(error){
        console.log(error);
        res.status(500).json({error: error.message});
    }
};

const saveImages=async(req,res)=>{
    try{
        const newImage=req.body;
        // if (!newImage.imageUrl.startsWith('<https://images.unsplash.com/>')) {
        //     return res.status(400).json({ message: 'Invalid image URL' });
        // }
       if(newImage.tags.length > 5){
         return res.status(400).json({message:"maximum 5 tags allowed"});
       }
       for(let i=0;i<newImage.tags.length;i++){
              if(newImage.tags[i].length > 20){
                   return res.status(400).json({message:"tag length should be less than 20"});
              }
       }
       const response=await photo.create(newImage);
      res.status(200).json({'message': 'Photo saved successfully',photos:response});
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
}

const addTagForPhoto=async(req,res)=>{
    try{
        const photoId=req.params.photoId;
        const newTag=req.body;
        if(newTag.tags.length > 5){
            return res.status(400).json({message:"maximum 5 tags allowed"});
        }
        for(let i=0;i<newTag.tags.length;i++){
            if(!newTag.tags[i]){
                return res.status(400).json({message:"Tags must be non-empty strings"})
            }
        }
        const tagsToInsert=newTag.tags.map(tag => ({name:tag,photoId:photoId}));
        const response=await tag.bulkCreate(tagsToInsert);
        res.status(200).json({'message': 'Tags added successfully',response});

    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
};

const searchByTagAndSortingByDateSaved=async(req,res)=>{
    try {
        const userId=req.query.userId;
        const tags=req.query.tags;
        const sort=req.query.sort;
        if (!tags || typeof tags !== 'string' || tags.includes(",") || tags.trim().includes(" ")) {
            return res.status(400).json({ message: "A single valid tag is required" });
        }

        if (userId) {
            await searchHistory.create({
              userId:userId, 
              query: tags, 
            });
      }
        const tagResults = await tag.findAll({where:{name:tags}});
        console.log("tagResults ", tagResults);
        if(tagResults.length === 0){
            return res.status(404).json({message:"no photos found for the given tags"});
        }
        const photoIds = tagResults.map(tagResult => tagResult.photoId);
        console.log("photoIds ",photoIds);
        const photoDetails = await photo.findAll({where:{id:photoIds}});
        const photoTags = await tag.findAll({where:{photoId:photoIds}});
        let result=[];
        for(let i=0;i<photoDetails.length;i++){
            result.push({
                imageUrl:photoDetails[i].imageUrl,
                description:photoDetails[i].description,
                dateSaved:photoDetails[i].dateSaved,
                tags:photoTags.filter(tag => tag.photoId === photoDetails[i].id).map(tag => tag.name)
            })
           
        }
        if(sort==="ASC"){
           result=result.sort((a,b)=> a.dateSaved-b.dateSaved);
        }
        else if(sort==="DESC"){
            result=result.sort((a,b)=> b.dateSaved-a.dateSaved);
        }
        else{
            result=result.sort((a,b)=> a.dateSaved-b.dateSaved);
        }
        res.status(200).json({photos:result});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }
};

const trackingANdDisplayingSearchHistory=async(req,res)=>{
    try{
        const userId=parseInt(req.query.userId);
        if(!await user.findOne({where:{id:userId}})){
            return res.status(404).json({message:"user not found"});
        }
        const searchQueries=await searchHistory.findAll(
            {
            where:{userId:userId},
            attributes:['query','timestamp'],
            }
        );
        res.status(200).json({searchHistory:searchQueries});

    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
};


module.exports={createNewUser,searchImages,saveImages,addTagForPhoto,searchByTagAndSortingByDateSaved,trackingANdDisplayingSearchHistory};