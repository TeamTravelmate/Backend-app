const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User:userModel,
    post: postModel,
    react_post: react_postModel,
    comment_post: comment_postModel,
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

            post.reactCount += 1;
            await post.save();

            res.status(200).send({
                message: "React added successfully",
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
    const {
        comment
    } = req.body;

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

            post.commentCount += 1;
            await post.save();

            res.status(200).send({
                message: "Comment added successfully",
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


module.exports = {
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
    viewReacts,
    commentPost,
    viewComments
};