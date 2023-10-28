const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
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
    upgrade_service_provider
} =  require('../controller/userController');

router.post('/register', register);
router.post('/login', login);

router.get('/myProfile', validateUser, myProfile);
router.get('/followingCount', validateUser, followingCount);
router.put('/editProfile', validateUser, editProfile);
router.put('/updatePassword', validateUser, updatePassword);

router.post('/createPost', validateUser, createPost);
router.get('/post/:postId', validateUser, post);
router.get('/myPosts', validateUser, myPosts);
router.get('/posts', validateUser, posts);
router.put('/reactPost/:postId', validateUser, reactPost);
router.get('/viewReacts/:postId', validateUser, viewReacts);
router.put('/commentPost/:postId', validateUser, commentPost);
router.get('/viewComments/:postId', validateUser, viewComments);
router.put('/sharePost/:postId', validateUser, sharePost); 

router.post('/fileComplaint/:id', validateUser, complaint);
router.post('/upgrade_travelguide', validateUser, upgrade_guide);
router.post('/upgrade_service_provider', validateUser, upgrade_service_provider);

module.exports = router;