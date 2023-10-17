const {

} = require('../models');

//***$baseUrl/follower***
// follow a user '$baseUrl/follower/follow/:id'
async function followUser(req, res) {

}

// unfollow a user '$baseUrl/follower/unfollow/:id'
async function unfollowUser(req, res) {

}

// get all followers of a user '$baseUrl/follower/followers/:id'
async function getFollowers(req, res) {

}

// get all users a user is following '$baseUrl/follower/following/:id'
async function getFollowing(req, res) {

}

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
};