const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User:userModel,
    post: postModel,
    react_post: react_postModel,
    comment_post: comment_postModel,
    follower: followerModel,
    share_post: share_postModel,
    complaint: complaintModel,
    travel_guide: travel_guideModel,
    service_provider: service_providerModel,
    vendor: vendorModel,
    sequelize
} = require('../models');
const crypto = require('crypto');

async function register (req, res, next) {
    try {
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            birthday,
            gender,
            phoneNo
        } = req.body;
        const checkUser = await userModel.findOne({
            where: {
                email: email
            }
        })
        if (checkUser) {
            res.status(400).send({
                message: 'User already exists'
            })
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            firstName,
            lastName,
            birthday,
            gender,
            username,
            email,
            phoneNo,
            password: hashedPassword,
        });
        //send a response to the client that the user was created with  the user object and token
        res.status(201).send({
            user: user,
            message: "User created successfully",
            sessionToken: jwt.sign({
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }, process.env.SECRET, {
                expiresIn: 60*60*24*30
            })
        });
    } catch (error) {
        res.status(500).send({
            message: 'Something went wrong'
        });
        console.log(error);
    }
}

async function login (req, res, next) {
    try {
        const {email,password} = req.body;
        //email check
        const user = await userModel.findOne({
            where: {
                email
            }
        });
        if (user == null) {
            return res.status(401).send({
                error: 'Invalid email or password'
            });
        }
        //password check
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                error: `Invalid email or password`
            });
        }

        const token = jwt.sign({
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }, process.env.SECRET, {
            expiresIn: 60*60*24*30
        });

        res.status(200).send({
            message: 'Login successful',
            status: true,
            token: token
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
}


//view profile '$baseUrl/user/myProfile'
async function myProfile (req, res) {
    try {
        const profile = await userModel.findOne({
          where: {
            email: req.user.email
          },
          attributes: [
            'firstName', 'lastName', 'username'
          ]
        })
        res.status(200).send(profile);
      } catch (err) {
        console.log(err);
        res.status(500).send({
          message: "Server error"
        });
      }
}

// add profile picture '$baseUrl/user/addProfilePic'

// get profile picture '$baseUrl/user/getProfilePic'

// edit profile picture '$baseUrl/user/editProfilePic'

// get following count '$baseUrl/user/followingCount'
async function followingCount(req, res) {
    try {
        const followingCount = await followerModel.count({
            where: {
                following_id: req.user.userId
            }
        });

        const followersCount = await followerModel.count({
            where: {
                user_id: req.user.userId
            }
        });

        res.status(200).send({
            followingCount: followingCount,
            followersCount: followersCount
        })
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

//edit profile '$baseUrl/user/editProfile'
async function editProfile(req, res) {
    try {
        let {
          firstName,
          lastName,
          userName,
          phoneNo
        } = req.body;
  
        const user = await userModel.findOne({
          where: {
              email: req.user.email
          }
        });
  
        if (!user) {
          return res.status(404).send({
            message: 'User not found'
          });
        }
  
      user.firstName = firstName;
      user.lastName = lastName;
      user.username = userName;
      user.phoneNo = phoneNo;
  
      await user.save();
  
      res.status(200).send({
        message: 'Profile updated successfully',
        user: user // Optionally, send back the updated user object
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: 'Server error'
      });
    }
}

//update password '$baseUrl/user/updatePassword'
async function updatePassword(req, res) {
    try{
        let {
            newPassword,
            confirmPassword
        }=req.body;
    

    const user = await userModel.findOne({
        where: {
            email: req.user.email
        }
    });

    if(!user){
        return res.status(404).send({
            message:'User not found'
        });
    }

    if(newPassword !== confirmPassword){
        return res.status(400).send({
            message:'Passwords do not match'
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password= hashedPassword;

    await user.save();

    res.status(200).send({
        message: 'Password Update Successfully',
        // user: user // Optionally, send back the updated user object
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: 'Server error'
      });
    }
}

//upgrade as a tour guide '$baseUrl/user/upgradeGuide'
async function upgrade_guide(req, res) {
    try {
      let {
        nic,
        nic_copy,
        SLTDA_license,
        language,
        no_of_experience,
        experience_field,
        price_per_day,
        status
      } = req.body;
  
      const userId = req.user.userId;

      const newUpgrade = await travel_guideModel.create({
        nic: nic,
        nic_copy: nic_copy,
        SLTDA_license: SLTDA_license,
        language: language,
        no_of_experience: no_of_experience,
        filed: experience_field,
        price_per_day: price_per_day,
        status: status,
        user_id: userId,
      });
      res.status(201).send({
        message: "Upgrade profile successfully",
        upgrde: newUpgrade
      });
      console.log(newUpgrade);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Server error"
      });
    }
};

//upgrade as a service provider '$baseUrl/user/upgradeServiceProvider'
async function upgrade_service_provider(req, res) {
    try {
      let {
        nic,
        nic_copy,
        STLDA_license,
        language,
        no_of_experience,
        experience_field,
        price_per_hour,
        address,
        tel_no,
        status
      } = req.body;
  
      const userId = req.user.userId;

      const newUpgrade = await service_providerModel.create({
        nic: nic,
        nic_copy: nic_copy,
        STLDA_license: STLDA_license,
        language: language,
        no_of_year: no_of_experience,
        field: experience_field,
        price_per_hour: price_per_hour,
        address: address,
        tel_no: tel_no,
        status: status,
        user_id: userId,
      });
      res.status(201).send({
        message: "Upgrade profile successfully",
        upgrde: newUpgrade
      });
      console.log(newUpgrade);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Server error"
      });
    }
};

//upgrade as a vendor '$baseUrl/user/upgradevendor'
async function upgrade_vendor(req, res) {
    try {
      let {
        address,
        business_reg_no,
        license_copy,
        tel_no,
        status,
      } = req.body;
  
      const userId = req.user.userId;

      const newUpgrade = await vendorModel.create({
        address: address,
        business_reg_no: business_reg_no,
        license_copy: license_copy,
        tel_no: tel_no,
        status: status,
        user_id: userId,
      });
      res.status(201).send({
        message: "Upgrade profile successfully",
        upgrde: newUpgrade
      });
      console.log(newUpgrade);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Server error"
      });
    }
};

// get membership '$baseUrl/user/getMembership'

// renew membership '$baseUrl/user/renewMembership'

//view my activities '$baseUrl/user/myActivities'

// create post '$baseUrl/user/createPost'
async function createPost(req, res) {
    let {
        content
    } = req.body;

    const userId = req.user.userId;

    try {
        const newPost = await postModel.create({
            content: content,
            shareCount: 0,
            reactCount: 0,
            commentCount: 0,
            userID: userId
        });
        res.status(200).send({
            message: "Post successfully added",
            newPost: newPost
        });
            
    } catch (err) {
        console.log(err);
        res.status(500).send({
          message: "Server error"
        });
    }
}

//get a specific post '$baseUrl/user/post/:postId'
async function post(req, res) {
    try {
        const post = await postModel.findOne({
            where: {
                id: req.params.postId
            },
            attributes: [
                'content', 'media', 'reactCount', 'commentCount', 'shareCount', 'createdAt'
            ],
            include: [
                {
                    model: userModel,
                    attributes: ['firstName','lastName','username'],
                    required: true,
                }
            ]
        })

        if (!post) {
            res.status(404).send({
                message: "Post not found"
            });
        }
        else {
            res.status(200).send(post);
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

//get all the posts '$baseUrl/user/myPosts'
async function myPosts(req, res) {
    try {
        const myPosts = await postModel.findAll({
          where: {
              userID: req.user.userId
          },
          order: [
            ['createdAt', 'DESC']
          ],
          attributes: [
            'content', 'media', 'reactCount', 'commentCount', 'shareCount', 'createdAt'
          ],
          include: [
            {
              model: userModel,
            //   on: sequelize.literal('User.id = post.userID'),
              attributes: ['firstName','lastName','username'],
              required: true,
            }
          ]
        })

        if (!myPosts) {
            res.status(404).send({
                message: "No posts found"
            });
        } else {
            res.status(200).send(myPosts);
        }
        
      } catch (err) {
        console.log(err);
        res.status(500).send({
          message: "Server error"
        });
      }
}

//get all the posts '$baseUrl/user/posts'
async function posts(req, res) {
    try {
        const posts = await postModel.findAll({
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: [
                'content', 'media', 'reactCount', 'commentCount', 'shareCount', 'createdAt'
            ],
            include: [
                {
                    model: userModel,
                    attributes: ['firstName','lastName','username'],
                    required: true,
                }
            ]
        })

        if (!posts) {
            res.status(404).send({
                message: "No posts found"
            });
        } else {
            res.status(200).send(posts);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// react & unreact post '$baseUrl/user/reactPost/:postId'
async function reactPost(req, res) {
    const userId = req.user.userId;
    const postId = req.params.postId;

    try {
        const post = await postModel.findByPk(req.params.postId);

        if (!post) {
            res.status(404).send({
                message: "Post not found"
            });
        } else {
            // check whether the user has already reacted to the post
            const checkReact = await react_postModel.findOne({
                where: {
                    user_id: userId,
                    post_id: postId
                }
            });

            if (checkReact) {
                // if user already reacted to the post already then clicks the icon again 
                // 1. post it will be unreact
                await react_postModel.destroy({
                    where: {
                        user_id: userId,
                        post_id: postId
                    }
                });

                // 2. react_count should be decreased by 1
                post.reactCount -= 1;
                await post.save();

                res.status(400).send({
                    message: "React removed successfully"
                });    
                return;
            }

            const react = await react_postModel.create({
                user_id: userId,
                post_id: postId
            });

            const user = await userModel.findOne({
                where: {
                    id: userId
                },
                attributes: ['firstName']
            });

            const reactnotification = user.firstName + " reacted to your post!";

            post.reactCount += 1;
            await post.save();

            res.status(200).send({
                message: reactnotification,
                post: post,
                react: react
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view reacts '$baseUrl/user/viewReacts/:postId'
async function viewReacts(req, res) {
    try {
        const post = await postModel.findByPk(req.params.postId);

        if (!post) {
            res.status(404).send({
                message: "Post not found"
            });
        } else {
            const reacts = await react_postModel.findAll({
                where: {
                    post_id: req.params.postId
                },
                attributes: ['post_id'],
                include: [
                    {
                        model: userModel,
                        attributes: ['firstName','lastName'],
                        required: true,
                    }
                ]
            });

            res.status(200).send({
                message: "Reacts found successfully",
                reacts: reacts
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// comment post '$baseUrl/user/commentPost/:postId'
async function commentPost(req, res) {
    const userId = req.user.userId;

    try {
        const post = await postModel.findByPk(req.params.postId);

        if (!post) {
            res.status(404).send({
                message: "Post not found"
            });
        } else {
            const comment = await comment_postModel.create({
                comment: req.body.comment,
                user_id: userId,
                post_id: req.params.postId
            });

            const user = await userModel.findOne({
                where: {
                    id: userId
                },
                attributes: ['firstName']
            });

            const commentnotification = user.firstName + " commented on your post!";

            post.commentCount += 1;
            await post.save();

            res.status(200).send({
                message: commentnotification,
                post: post
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view comments '$baseUrl/user/viewComments/:postId'
async function viewComments(req, res) {
    try {
        const post = await postModel.findByPk(req.params.postId);

        if (!post) {
            res.status(404).send({
                message: "Post not found"
            });
        } else {
            const comments = await comment_postModel.findAll({
                where: {
                    post_id: req.params.postId
                },
                attributes: ['comment'],
                include: [
                    {
                        model: userModel,
                        attributes: ['firstName','lastName'],
                        required: true,
                    }
                ]
            });

            res.status(200).send({
                message: "Comments found successfully",
                comments: comments
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// share post using link '$baseUrl/user/sharePost/:postId'
async function sharePost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user.userId;
        
        // check whether the post exists
        const postToShare = await postModel.findByPk(postId);
        if (!postToShare) {
            res.status(404).send({
                message: "Post not found"
            });
            return;
        }

        // Generate a cryptographically secure random string for the shareable link
        function generateCryptographicallySecureRandomString() {
            return crypto.randomBytes(32).toString('hex');
        }
  
        const randomString = generateCryptographicallySecureRandomString();
  
        // Create the shareable link
        const shareableLink = `http://localhost:3000/post/share/${randomString}`;

        const sharePost = await share_postModel.create({
            post_id: postId,
            user_id: userId,
            link: shareableLink
        });
        
        // increase the share count by 1
        const post = await postModel.findByPk(postId);
        post.shareCount += 1;
        await post.save();

        res.status(200).send({
            message: "Post shared successfully",
            share: sharePost,
            shareCount: post.shareCount
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

//*** Complaints ***
// file complaint '$baseUrl/user/fileComplaint/:id'
async function complaint(req, res) {
    const userId = req.user.userId;
    const id = req.params.id;

    let {
        title,
        category
    } = req.body;

    try {
        const complaint = await complaintModel.create({
            user_id: userId,
            title: title,
            category: category,
            content_id: id,
            status: "pending"
        });

        res.status(200).send({
            message: "Complaint successfully added",
            complaint: complaint
        });
            
    } catch (err) {
        console.log(err);
        res.status(500).send({
          message: "Server error"
        });
    }
}

module.exports = {
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
};