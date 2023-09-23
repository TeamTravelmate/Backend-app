const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const {
    register,
    login,
    myProfile,
    editProfile,
    updatePassword,
    createPost,
    post,
    myPosts,
    posts,
    reactPost,
} =  require('../controller/userController');

router.post('/register', register);
router.post('/login', login);

router.get('/myProfile', validateUser, myProfile);
router.put('/editProfile', validateUser, editProfile);
router.put('/updatePassword', validateUser, updatePassword);

router.post('/createPost', validateUser, createPost);
router.get('/post/:postId', validateUser, post);
router.get('/myPosts', validateUser, myPosts);
router.get('/posts', validateUser, posts);
router.put('/reactPost/:postId', validateUser, reactPost);


module.exports = router;