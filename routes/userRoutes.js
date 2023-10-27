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
    complaint,
    viewComplaint,
    postComplaintsPending,
    postComplaintsResolved,
    postComplaintsIgnored,
    commentComplaintsPending,
    commentComplaintsResolved,
    commentComplaintsIgnored,
    userComplaintsPending,
    userComplaintsResolved,
    userComplaintsIgnored,
    orgComplaintsPending,
    orgComplaintsResolved,
    orgComplaintsIgnored,
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

router.post('/fileComplaint/:id', validateUser, complaint);
router.get('/viewComplaint/:id', validateUser, viewComplaint);

router.get('/postComplaintsPending', validateUser, postComplaintsPending);
router.get('/postComplaintsResolved', validateUser, postComplaintsResolved);
router.get('/postComplaintsIgnored', validateUser, postComplaintsIgnored);
router.get('/commentComplaintsPending', validateUser, commentComplaintsPending);
router.get('/commentComplaintsResolved', validateUser, commentComplaintsResolved);
router.get('/commentComplaintsIgnored', validateUser, commentComplaintsIgnored);
router.get('/userComplaintsPending', validateUser, userComplaintsPending);
router.get('/userComplaintsResolved', validateUser, userComplaintsResolved);
router.get('/userComplaintsIgnored', validateUser, userComplaintsIgnored);
router.get('/orgComplaintsPending', validateUser, orgComplaintsPending);
router.get('/orgComplaintsResolved', validateUser, orgComplaintsResolved);
router.get('/orgComplaintsIgnored', validateUser, orgComplaintsIgnored);


module.exports = router;