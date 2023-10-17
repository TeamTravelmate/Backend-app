const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} = require('../controller/followerController');

router.post('/follow/:id', validateUser, followUser);
router.delete('/unfollow/:id', validateUser, unfollowUser);
router.get('/followers/:id', validateUser, getFollowers);
router.get('/following/:id', validateUser, getFollowing);

module.exports = router;