
const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const { uploadMiddleware } = require('../middleware/upload');
const { upload_postMiddleware } = require('../middleware/upload_post');
const {
    register,
    login,
    myProfile,
    followingCount,
    editProfile,
    updatePassword,
    createPost,
    post,
    myPosts,
    posts,
    reactPost,
    viewReacts,
    commentPost,
    viewComments,
    sharePost,
    complaint,
    upgrade_guide,
    upgrade_service_provider,
    upgrade_vendor
} =  require('../controller/userController');
const { application } = require('express');
const { sp_nicMiddleware } = require('../middleware/sp_nic');
const { sp_SLTDAMiddleware } = require('../middleware/sp_SLTDA');
const { tg_SLTDAMiddleware } = require('../middleware/tg_SLTDA');
const { vendor_licenseMiddleware } = require('../middleware/vendor_license');

router.post('/register', register);
router.post('/login', login);

router.get('/myProfile', validateUser, myProfile);
router.get('/followingCount', validateUser, followingCount);
router.put('/editProfile', validateUser, uploadMiddleware.single('file'), editProfile);
router.put('/updatePassword', validateUser, updatePassword);

router.post('/createPost', validateUser, upload_postMiddleware.single('file'), createPost);
router.get('/post/:postId', validateUser, post);
router.get('/myPosts', validateUser, myPosts);
router.get('/posts', validateUser, posts);
router.put('/reactPost/:postId', validateUser, reactPost);
router.get('/viewReacts/:postId', validateUser, viewReacts);
router.put('/commentPost/:postId', validateUser, commentPost);
router.get('/viewComments/:postId', validateUser, viewComments);
router.put('/sharePost/:postId', validateUser, sharePost); 

router.post('/fileComplaint/:id', validateUser, complaint);
router.post('/upgrade_travelguide', validateUser, tg_SLTDAMiddleware.single('file'), upgrade_guide);
router.post('/upgrade_service_provider', validateUser, sp_SLTDAMiddleware.single('file'),upgrade_service_provider);
router.post('/upgrade_vendor', validateUser, vendor_licenseMiddleware.single('file'),upgrade_vendor);

module.exports = router;