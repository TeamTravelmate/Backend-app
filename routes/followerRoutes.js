const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const {
    followRequest,
    acceptRequest,
    rejectRequest,
    unfollow,
    getFollowers,
    getFollowings,
    getFriends
} = require('../controller/followerController');

router.post('/request/:id', validateUser, followRequest);
router.post('/accept/:id', validateUser, acceptRequest);
router.delete('/reject/:id', validateUser, rejectRequest);

router.delete('/unfollow/:id', validateUser, unfollow);

router.get('/followers', validateUser, getFollowers);
router.get('/following', validateUser, getFollowings);
router.get('/friends', validateUser, getFriends);

module.exports = router;