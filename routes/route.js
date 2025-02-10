
const router=require('express').Router();
const {createNewUser,searchImages,saveImages,addTagForPhoto,searchByTagAndSortingByDateSaved,trackingANdDisplayingSearchHistory}=require('../controllers/controller.js');


router.route('/users').post(createNewUser);
router.route('/photos/search').get(searchImages);
router.route('/photos').post(saveImages);
router.route('/photos/:photoId/tags').post(addTagForPhoto);
router.route('/photos/tag/search').get(searchByTagAndSortingByDateSaved);
router.route('/search-history').get(trackingANdDisplayingSearchHistory);

module.exports=router;