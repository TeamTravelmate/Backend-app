const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User:userModel,
    post: postModel,
    react_post: react_postModel,
    comment_post: comment_postModel,
    follower: followerModel,
    complaint: complaintModel,
    sequelize
} = require('../models');

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

//upgrade as a service provider '$baseUrl/user/upgradeServiceProvider'

//upgrade as a vendor '$baseUrl/user/upgradevendor'

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

// share post '$baseUrl/user/sharePost/:postId'


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

// view complaint '$baseUrl/user/viewComplaint/:id'
async function viewComplaint(req, res) {
    const complaintId = req.params.id;
    try {
        const complaint = await complaintModel.findOne({
            where: {
                id: complaintId
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        })

        complaint.category = complaint.category.toLowerCase();

        // get the content of the complaint
        switch (complaint.category) {
            case "post":
                const post = await postModel.findOne({
                    where: {
                        id: complaint.content_id
                    },
                    attributes: ['content', 'media','createdAt']
                });
                complaint.content = post;
                break;
            case "comment":
                const comment = await comment_postModel.findOne({
                    where: {
                        id: complaint.content_id
                    },
                    attributes: ['comment','createdAt']
                });
                complaint.content = comment;
                break;
            case "user":
                const user = await userModel.findOne({
                    where: {
                        id: complaint.content_id
                    },
                    attributes: ['firstName','lastName','username','email','phoneNo','createdAt']
                });
                complaint.content = user;
                break;
            case "trip organizers": 
                const organizer = await userModel.findOne({
                    where: {
                        id: complaint.content_id
                    },
                    attributes: ['firstName','lastName','username','email','phoneNo','createdAt']
                });
                complaint.content = organizer;
                break;
            default:
                break;
        }

        if (!complaint) {
            res.status(404).send({
                message: "Complaint not found"
            });
        }
        else {
            res.status(200).send({
                message: "Complaint found successfully",
                complaint: complaint,
                Content: complaint.content
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view post complaints '$baseUrl/user/postComplaintsPending'
async function postComplaintsPending(req, res) {
    try {
        // get all the complaints by category - post, pending
        const postComplaintsPending = await complaintModel.findAll({
            where: {
                category: "post",
                status: "pending"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (postComplaintsPending.length === 0) {
            res.status(200).send({
                message: "No pending complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < postComplaintsPending.length; i++) {
                const post = await postModel.findOne({
                    where: {
                        id: postComplaintsPending[i].content_id
                    },
                    attributes: ['content', 'media','createdAt']
                });
                postComplaintsPending[i].content = post;
            }

            // store the post compalints with the contents in an array
            const pendingPostWithContent = [];
            for (let i = 0; i < postComplaintsPending.length; i++) {
                pendingPostWithContent.push(postComplaintsPending[i]);
                pendingPostWithContent.push(postComplaintsPending[i].content);
            }

            res.status(200).send({
                message: "Pending complaints found successfully",
                pending: pendingPostWithContent
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view post complaints - resolved '$baseUrl/user/postComplaintsResolved'
async function postComplaintsResolved(req, res) {
    try {
        // get all the complaints by category - post, resolved
        const postComplaintsResolved = await complaintModel.findAll({
            where: {
                category: "post",
                status: "resolved"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (postComplaintsResolved.length === 0) {
            res.status(200).send({
                message: "No resolved complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < postComplaintsResolved.length; i++) {
                const post = await postModel.findOne({
                    where: {
                        id: postComplaintsResolved[i].content_id
                    },
                    attributes: ['content', 'media','createdAt']
                });
                postComplaintsResolved[i].content = post;
            }

            // store the post compalints with the contents in an array
            const resolvedPostWithContent = [];
            for (let i = 0; i < postComplaintsResolved.length; i++) {
                resolvedPostWithContent.push(postComplaintsResolved[i]);
                resolvedPostWithContent.push(postComplaintsResolved[i].content);
            }

            res.status(200).send({
                message: "Resolved complaints found successfully",
                resolved: resolvedPostWithContent
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view post complaints - ignored '$baseUrl/user/postComplaintsIgnored'
async function postComplaintsIgnored(req, res) {
    try {
        // get all the complaints by category - post, ignored
        const postComplaintsIgnored = await complaintModel.findAll({
            where: {
                category: "post",
                status: "ignored"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (postComplaintsIgnored.length === 0) {
            res.status(200).send({
                message: "No ignored complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < postComplaintsIgnored.length; i++) {
                const post = await postModel.findOne({
                    where: {
                        id: postComplaintsIgnored[i].content_id
                    },
                    attributes: ['content', 'media','createdAt']
                });
                postComplaintsIgnored[i].content = post;
            }

            // store the post compalints with the contents in an array
            const ignoredPostWithContent = [];
            for (let i = 0; i < postComplaintsIgnored.length; i++) {
                ignoredPostWithContent.push(postComplaintsIgnored[i]);
                ignoredPostWithContent.push(postComplaintsIgnored[i].content);
            }

            res.status(200).send({
                message: "Ignored complaints found successfully",
                ignored: ignoredPostWithContent
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view comment complaints '$baseUrl/user/commentComplaintsPending'
async function commentComplaintsPending(req, res) {
    try {
        // get all the complaints by category - comment, pending
        const commentComplaintsPending = await complaintModel.findAll({
            where: {
                category: "comment",
                status: "pending"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (commentComplaintsPending.length === 0) {
            res.status(200).send({
                message: "No pending complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < commentComplaintsPending.length; i++) {
                const comment = await comment_postModel.findOne({
                    where: {
                        id: commentComplaintsPending[i].content_id
                    },
                    attributes: ['comment','createdAt']
                });
                commentComplaintsPending[i].content = comment;
            }

            // store the comment compalints with the contents in an array
            const pendingCommentWithContent = [];
            for (let i = 0; i < commentComplaintsPending.length; i++) {
                pendingCommentWithContent.push(commentComplaintsPending[i]);
                pendingCommentWithContent.push(commentComplaintsPending[i].content);
            }

            res.status(200).send({
                message: "Pending complaints found successfully",
                pending: pendingCommentWithContent
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view comment complaints - resolved '$baseUrl/user/commentComplaintsResolved'
async function commentComplaintsResolved(req, res) {
    try {
        // get all the complaints by category - comment, resolved
        const commentComplaintsResolved = await complaintModel.findAll({
            where: {
                category: "comment",
                status: "resolved"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (commentComplaintsResolved.length === 0) {
            res.status(200).send({
                message: "No resolved complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < commentComplaintsResolved.length; i++) {
                const comment = await comment_postModel.findOne({
                    where: {
                        id: commentComplaintsResolved[i].content_id
                    },
                    attributes: ['comment','createdAt']
                });
                commentComplaintsResolved[i].content = comment;
            }

            // store the comment compalints with the contents in an array
            const resolvedCommentWithContent = [];
            for (let i = 0; i < commentComplaintsResolved.length; i++) {
                resolvedCommentWithContent.push(commentComplaintsResolved[i]);
                resolvedCommentWithContent.push(commentComplaintsResolved[i].content);
            }

            res.status(200).send({
                message: "Resolved complaints found successfully",
                resolved: resolvedCommentWithContent
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view comment complaints - ignored '$baseUrl/user/commentComplaintsIgnored'
async function commentComplaintsIgnored(req, res) {
    try {
        // get all the complaints by category - comment, ignored
        const commentComplaintsIgnored = await complaintModel.findAll({
            where: {
                category: "comment",
                status: "ignored"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (commentComplaintsIgnored.length === 0) {
            res.status(200).send({
                message: "No ignored complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < commentComplaintsIgnored.length; i++) {
                const comment = await comment_postModel.findOne({
                    where: {
                        id: commentComplaintsIgnored[i].content_id
                    },
                    attributes: ['comment','createdAt']
                });
                commentComplaintsIgnored[i].content = comment;
            }

            // store the comment compalints with the contents in an array
            const ignoredCommentWithContent = [];
            for (let i = 0; i < commentComplaintsIgnored.length; i++) {
                ignoredCommentWithContent.push(commentComplaintsIgnored[i]);
                ignoredCommentWithContent.push(commentComplaintsIgnored[i].content);
            }

            res.status(200).send({
                message: "Ignored complaints found successfully",
                ignored: ignoredCommentWithContent
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view user complaints - pending '$baseUrl/user/userComplaintsPending'
async function userComplaintsPending(req, res) {
    try {
        // get all the complaints by category - user, pending
        const userComplaintsPending = await complaintModel.findAll({
            where: {
                category: "user",
                status: "pending"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (userComplaintsPending.length === 0) {
            res.status(200).send({
                message: "No pending complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < userComplaintsPending.length; i++) {
                const user = await userModel.findOne({
                    where: {
                        id: userComplaintsPending[i].content_id
                    },
                    attributes: ['firstName','lastName','username','email','phoneNo','createdAt']
                });
                userComplaintsPending[i].content = user;
            }

            // store the user compalints with the contents in an array
            const pendingUserWithContent = [];
            for (let i = 0; i < userComplaintsPending.length; i++) {
                pendingUserWithContent.push(userComplaintsPending[i]);
                pendingUserWithContent.push(userComplaintsPending[i].content);
            }

            res.status(200).send({
                message: "Pending complaints found successfully",
                pending: pendingUserWithContent
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view user complaints - resolved '$baseUrl/user/userComplaintsResolved'
async function userComplaintsResolved(req, res) {
    try {
        // get all the complaints by category - user, resolved
        const userComplaintsResolved = await complaintModel.findAll({
            where: {
                category: "user",
                status: "resolved"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (userComplaintsResolved.length === 0) {
            res.status(200).send({
                message: "No resolved complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < userComplaintsResolved.length; i++) {
                const user = await userModel.findOne({
                    where: {
                        id: userComplaintsResolved[i].content_id
                    },
                    attributes: ['firstName','lastName','username','email','phoneNo','createdAt']
                });
                userComplaintsResolved[i].content = user;
            }

            // store the user compalints with the contents in an array
            const resolvedUserWithContent = [];
            for (let i = 0; i < userComplaintsResolved.length; i++) {
                resolvedUserWithContent.push(userComplaintsResolved[i]);
                resolvedUserWithContent.push(userComplaintsResolved[i].content);
            }

            res.status(200).send({
                message: "Resolved complaints found successfully",
                resolved: resolvedUserWithContent
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view user complaints - ignored '$baseUrl/user/userComplaintsIgnored'
async function userComplaintsIgnored(req, res) {
    try {
        // get all the complaints by category - user, ignored
        const userComplaintsIgnored = await complaintModel.findAll({
            where: {
                category: "user",
                status: "ignored"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (userComplaintsIgnored.length === 0) {
            res.status(200).send({
                message: "No ignored complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < userComplaintsIgnored.length; i++) {
                const user = await userModel.findOne({
                    where: {
                        id: userComplaintsIgnored[i].content_id
                    },
                    attributes: ['firstName','lastName','username','email','phoneNo','createdAt']
                });
                userComplaintsIgnored[i].content = user;
            }

            // store the user compalints with the contents in an array
            const ignoredUserWithContent = [];
            for (let i = 0; i < userComplaintsIgnored.length; i++) {
                ignoredUserWithContent.push(userComplaintsIgnored[i]);
                ignoredUserWithContent.push(userComplaintsIgnored[i].content);
            }

            res.status(200).send({
                message: "Ignored complaints found successfully",
                ignored: ignoredUserWithContent
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// view trip organizer complaints - pending '$baseUrl/user/orgComplaintsPending'
async function orgComplaintsPending(req, res) {
    try {
        // get all the complaints by category - trip organizers, pending
        const orgComplaintsPending = await complaintModel.findAll({
            where: {
                category: "trip organizers",
                status: "pending"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (orgComplaintsPending.length === 0) {
            res.status(200).send({
                message: "No pending complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < orgComplaintsPending.length; i++) {
                const organizer = await userModel.findOne({
                    where: {
                        id: orgComplaintsPending[i].content_id
                    },
                    attributes: ['firstName','lastName','username','email','phoneNo','createdAt']
                });
                orgComplaintsPending[i].content = organizer;
            }

            // store the organizer compalints with the contents in an array
            const pendingOrgWithContent = [];
            for (let i = 0; i < orgComplaintsPending.length; i++) {
                pendingOrgWithContent.push(orgComplaintsPending[i]);
                pendingOrgWithContent.push(orgComplaintsPending[i].content);
            }

            res.status(200).send({
                message: "Pending complaints found successfully",
                pending: pendingOrgWithContent
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// view trip organizer complaints - resolved '$baseUrl/user/orgComplaintsResolved'
async function orgComplaintsResolved(req, res) {
    try {
        // get all the complaints by category - trip organizers, resolved
        const orgComplaintsResolved = await complaintModel.findAll({
            where: {
                category: "trip organizers",
                status: "resolved"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (orgComplaintsResolved.length === 0) {
            res.status(200).send({
                message: "No resolved complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < orgComplaintsResolved.length; i++) {
                const organizer = await userModel.findOne({
                    where: {
                        id: orgComplaintsResolved[i].content_id
                    },
                    attributes: ['firstName','lastName','username','email','phoneNo','createdAt']
                });
                orgComplaintsResolved[i].content = organizer;
            }

            // store the organizer compalints with the contents in an array
            const resolvedOrgWithContent = [];
            for (let i = 0; i < orgComplaintsResolved.length; i++) {
                resolvedOrgWithContent.push(orgComplaintsResolved[i]);
                resolvedOrgWithContent.push(orgComplaintsResolved[i].content);
            }

            res.status(200).send({
                message: "Resolved complaints found successfully",
                resolved: resolvedOrgWithContent
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// view trip organizer complaints - ignored '$baseUrl/user/orgComplaintsIgnored'
async function orgComplaintsIgnored(req, res) {
    try {
        // get all the complaints by category - trip organizers, ignored
        const orgComplaintsIgnored = await complaintModel.findAll({
            where: {
                category: "trip organizers",
                status: "ignored"
            },
            attributes: ['user_id', 'title', 'category', 'status', 'content_id']
        });

        // if there are no complaints display a message and exit
        if (orgComplaintsIgnored.length === 0) {
            res.status(200).send({
                message: "No ignored complaints found"
            });
            return;
        } else {
            // get the contents of the complaints
            for (let i = 0; i < orgComplaintsIgnored.length; i++) {
                const organizer = await userModel.findOne({
                    where: {
                        id: orgComplaintsIgnored[i].content_id
                    },
                    attributes: ['firstName','lastName','username','email','phoneNo','createdAt']
                });
                orgComplaintsIgnored[i].content = organizer;
            }

            // store the organizer compalints with the contents in an array
            const ignoredOrgWithContent = [];
            for (let i = 0; i < orgComplaintsIgnored.length; i++) {
                ignoredOrgWithContent.push(orgComplaintsIgnored[i]);
                ignoredOrgWithContent.push(orgComplaintsIgnored[i].content);
            }

            res.status(200).send({
                message: "Ignored complaints found successfully",
                ignored: ignoredOrgWithContent
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
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
    orgComplaintsIgnored
};