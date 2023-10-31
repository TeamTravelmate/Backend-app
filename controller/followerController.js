const {
    notification_follow: notification_followModel,
    follower: followerModel,
    User: UserModel,
    sequelize
} = require('../models');

const { Op } = require('sequelize');

//***$baseUrl/follower***
// follower request '$baseUrl/follower/request/:id'
async function followRequest(req, res) {
    const user_ID = req.user.userId;
    const follow_ID = req.params.id;

    try {
        const followRequest = await notification_followModel.create({
            sender_id: user_ID,
            receiver_id: follow_ID,
            status: "FALSE",
            date: new Date(),
            time: sequelize.literal('CURRENT_TIMESTAMP')
        });

        const sender = await UserModel.findOne({
            where: {
                id: user_ID
            },
            attributes: ['firstName']
        });

        const follownotification = sender.firstName + " requested to follow you!";

        res.status(200).json({
            message: follownotification,
            followRequest
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error!"
        })
    }
}

// accept a follower request '$baseUrl/follower/accept/:id'
async function acceptRequest(req, res){
    const user_ID = req.user.userId; //id of the user who accepted the request
    const follow_ID = req.params.id; //id of the user who sent the follow request

    try {
        // update the status of the notification to TRUE
        const acceptRequest = await notification_followModel.update({
            status: "TRUE"
        }, {
            where: {
                sender_id: follow_ID,
                receiver_id: user_ID
            }
        });

        const follower = await followerModel.create({
            user_id: user_ID, //id of the user who accepted the request
            following_id: follow_ID //id of the user who sent the request
        });

        const sender = await UserModel.findOne({
            where: {
                id: follow_ID
            },
            attributes: ['firstName']
        });

        const follownotification = sender.firstName + " is now following you!";

        res.status(200).json({
            message: follownotification,
            followerDetails: follower
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error!"
        })
    }
}

// reject a follower request '$baseUrl/follower/reject/:id'
async function rejectRequest(req, res){
    const user_ID = req.user.userId; //id of the user who rejected the request
    const follow_ID = req.params.id; //id of the user who sent the follow request

    try {
        const rejectRequest = await notification_followModel.destroy({
            where: {
                sender_id: follow_ID,
                receiver_id: user_ID
            }
        });

        res.status(200).json({
            message: "Follow request rejected!",
            rejected: rejectRequest
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error!"
        })
    }
}

// unfollow a user '$baseUrl/follower/unfollow/:id'
async function unfollow(req, res){
    const user_ID = req.user.userId; //id of the user who is unfollowing
    const follow_ID = req.params.id; //id of the user who is being unfollowed

    try {
        const unfollow = await followerModel.destroy({
            where: {
                user_id: user_ID,
                following_id: follow_ID
            }
        });

        const userDetails = await UserModel.findOne({
            where: {
                id: user_ID
            },
            attributes: ['firstName']
        });

        const unfollownotification = userDetails.firstName + " unfollowed you!";

        res.status(200).json({
            message: unfollownotification,
            unfollowed: unfollow
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error!"
        })
    }
}

// get all followers of a user '$baseUrl/follower/followers'
async function getFollowers(req, res){
    const user_ID = req.user.userId;

    try {
        const followers = await followerModel.findAll({
            where: {
                user_id: user_ID
            },
            attributes: ['following_id']
        });

        if (followers.length === 0 || !followers) {
            return res.status(200).json({
                message: "You don't have any followers!"
            });
        }

        const followersArray = followers.map(follower => follower.following_id);

        // get the details of the followers from user table
        const followersDetails = await UserModel.findAll({
            where: {
                id: followersArray
            },
            attributes: ['firstName', 'lastName', 'username', 'email']
        });

        // concat the first name and last name of the followers
        const followersName = followersDetails.map(follower => follower.firstName + " " + follower.lastName);

        // store the details of the followers (name and email)
        const follower = followersDetails.map((follower, index) => {
            return {
                name: followersName[index],
                email: follower.email
            }
        });


        res.status(200).json({
            follower: follower
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error!"
        })
    }
}

// get all users a user is following '$baseUrl/follower/following'
async function getFollowings(req, res){
    const user_ID = req.user.userId;

    try {
        const followings = await followerModel.findAll({
            where: {
                following_id: user_ID
            },
            attributes: ['user_id']
        });

        if (followings.length === 0 || !followings) {
            return res.status(200).json({
                message: "You are not following anyone!"
            });
        }

        const followingsArray = followings.map(following => following.user_id);

        // get the details of the followings from user table
        const followingsDetails = await UserModel.findAll({
            where: {
                id: followingsArray
            },
            attributes: ['firstName', 'lastName', 'username', 'email']
        });

        // concat the first name and last name of the followings
        const followingsName = followingsDetails.map(following => following.firstName + " " + following.lastName);

        // store the details of the followings (name and email)
        const following = followingsDetails.map((following, index) => {
            return {
                name: followingsName[index],
                email: following.email
            }
        });

        res.status(200).json({
            following: following
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error!"
        })
    }
}

// get all friends of a user '$baseUrl/follower/friends'
async function getFriends(req, res){
    const user_ID = req.user.userId;

    try {
        const friends = await followerModel.findAll({
            // get all following & followers of a user
            where: {
                [Op.or]: [{
                    user_id: user_ID
                }, {
                    following_id: user_ID
                }]
            },
            attributes: ['following_id']
        });

        if (friends.length === 0 || !friends) {
            return res.status(200).json({
                message: "You don't have any friends!"
            });
        }

        const friendsArray = friends.map(friend => friend.following_id);

        // get the details of the friends from user table
        const friendsDetails = await UserModel.findAll({
            where: {
                id: friendsArray
            },
            attributes: ['firstName', 'lastName', 'username', 'email']
        });

        res.status(200).json({
            friendsDetails
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error!"
        })
    }
}

module.exports = {
    followRequest,
    acceptRequest,
    rejectRequest,
    unfollow,
    getFollowers,
    getFollowings,
    getFriends
};