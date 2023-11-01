const { where } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User:userModel,
    post: postModel,
    comment_post: comment_postModel,
    complaint: complaintModel,
    travel_guide: travel_guideModel,
    service_provider: service_providerModel,
    vendor: vendorModel,
    trip: tripModel,
    admin: adminModel,
    sequelize
} = require('../models');
const { Op } = require('sequelize');

// *** Admin Authentication ***
async function AdminRegister(req, res, next) {
    try {
        const {
            username,
            email,
            password
        } = req.body;

        const checkAdmin = await adminModel.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        });

        if (checkAdmin) {
            return res.status(409).send({
                message: 'Admin Account already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await adminModel.create({
            username,
            email,
            password: hashedPassword
        });

        //send a response to the client that the user was created with  the user object and token
        res.status(201).send({
            admin: admin,
            message: 'Admin Account created successfully',
            sessionToken: jwt.sign({ 
                id: admin.id,
                username: admin.username,
                email: admin.email,
                isAdmin: true
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

async function AdminLogin(req, res, next) {
    try {
        const {
            email,
            password
        } = req.body;

        // check if the admin exists
        const admin = await adminModel.findOne({
            where: {
                email: email
            }
        });

        if (!admin) {
            return res.status(401).send({
                message: 'Invalid email or password'
            });
        }

        // check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign({
            id: admin.id,
            username: admin.username,
            email: admin.email,
            isAdmin: true
        }, process.env.SECRET, {
            expiresIn: 60*60*24*30
        });

        res.status(200).send({
            message: 'Admin Login successful',
            status: true,
            token: token
        });
    } catch (error) {
        console.error('Error in AdminLogin: ', error);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
}



// *** handle complaints ***
// view complaint '$baseUrl/admin/viewComplaint/:id'
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

// view post complaints '$baseUrl/admin/postComplaintsPending'
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

        // get the count of the complaints - post, pending
        const postPendingCount = await complaintModel.count({
            where: {
                category: "post",
                status: "pending"
            }
        });

        // if there are no complaints display a message and exit
        if (postComplaintsPending.length === 0) {
            res.status(200).send({
                message: "No pending complaints found",
                count: postPendingCount
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
                count: postPendingCount,
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

// view post complaints - resolved '$baseUrl/admin/postComplaintsResolved'
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

        // get the count of the complaints - post, resolved
        const postResolvedCount = await complaintModel.count({
            where: {
                category: "post",
                status: "resolved"
            }
        });

        // if there are no complaints display a message and exit
        if (postComplaintsResolved.length === 0) {
            res.status(200).send({
                message: "No resolved complaints found",
                count: postResolvedCount
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
                count: postResolvedCount,
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

// view post complaints - ignored '$baseUrl/admin/postComplaintsIgnored'
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

        // get the count of the complaints - post, ignored
        const postIgnoredCount = await complaintModel.count({
            where: {
                category: "post",
                status: "ignored"
            }
        });

        // if there are no complaints display a message and exit
        if (postComplaintsIgnored.length === 0) {
            res.status(200).send({
                message: "No ignored complaints found",
                count: postIgnoredCount
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
                count: postIgnoredCount,
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

// view comment complaints '$baseUrl/admin/commentComplaintsPending'
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

        // get the count of the complaints - comment, pending
        const commentPendingCount = await complaintModel.count({
            where: {
                category: "comment",
                status: "pending"
            }
        });

        // if there are no complaints display a message and exit
        if (commentComplaintsPending.length === 0) {
            res.status(200).send({
                message: "No pending complaints found",
                count: commentPendingCount
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
                count: commentPendingCount,
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

// view comment complaints - resolved '$baseUrl/admin/commentComplaintsResolved'
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

        // get the count of the complaints - comment, resolved
        const commentResolvedCount = await complaintModel.count({
            where: {
                category: "comment",
                status: "resolved"
            }
        });

        // if there are no complaints display a message and exit
        if (commentComplaintsResolved.length === 0) {
            res.status(200).send({
                message: "No resolved complaints found",
                count: commentResolvedCount
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
                count: commentResolvedCount,
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

// view comment complaints - ignored '$baseUrl/admin/commentComplaintsIgnored'
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

        // get the count of the complaints - comment, ignored
        const commentIgnoredCount = await complaintModel.count({
            where: {
                category: "comment",
                status: "ignored"
            }
        });

        // if there are no complaints display a message and exit
        if (commentComplaintsIgnored.length === 0) {
            res.status(200).send({
                message: "No ignored complaints found",
                count: commentIgnoredCount
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
                count: commentIgnoredCount,
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

// view user complaints - pending '$baseUrl/admin/userComplaintsPending'
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

        // get the count of the complaints - user, pending
        const userPendingCount = await complaintModel.count({
            where: {
                category: "user",
                status: "pending"
            }
        });

        // if there are no complaints display a message and exit
        if (userComplaintsPending.length === 0) {
            res.status(200).send({
                message: "No pending complaints found",
                count: userPendingCount
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
                count: userPendingCount,
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

// view user complaints - resolved '$baseUrl/admin/userComplaintsResolved'
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

        // get the count of the complaints - user, resolved
        const userResolvedCount = await complaintModel.count({
            where: {
                category: "user",
                status: "resolved"
            }
        });

        // if there are no complaints display a message and exit
        if (userComplaintsResolved.length === 0) {
            res.status(200).send({
                message: "No resolved complaints found",
                count: userResolvedCount
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
                count: userResolvedCount,
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

// view user complaints - ignored '$baseUrl/admin/userComplaintsIgnored'
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

        // get the count of the complaints - user, ignored
        const userIgnoredCount = await complaintModel.count({
            where: {
                category: "user",
                status: "ignored"
            }
        });

        // if there are no complaints display a message and exit
        if (userComplaintsIgnored.length === 0) {
            res.status(200).send({
                message: "No ignored complaints found",
                count: userIgnoredCount
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
                count: userIgnoredCount,
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

// view trip organizer complaints - pending '$baseUrl/admin/orgComplaintsPending'
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

        // get the count of the complaints - trip organizers, pending
        const orgPendingCount = await complaintModel.count({
            where: {
                category: "trip organizers",
                status: "pending"
            }
        });

        // if there are no complaints display a message and exit
        if (orgComplaintsPending.length === 0) {
            res.status(200).send({
                message: "No pending complaints found",
                count: orgPendingCount
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
                count: orgPendingCount,
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

// view trip organizer complaints - resolved '$baseUrl/admin/orgComplaintsResolved'
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

        // get the count of the complaints - trip organizers, resolved
        const orgResolvedCount = await complaintModel.count({
            where: {
                category: "trip organizers",
                status: "resolved"
            }
        });

        // if there are no complaints display a message and exit
        if (orgComplaintsResolved.length === 0) {
            res.status(200).send({
                message: "No resolved complaints found",
                count: orgResolvedCount
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
                count: orgResolvedCount,
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

// view trip organizer complaints - ignored '$baseUrl/admin/orgComplaintsIgnored'
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

        // get the count of the complaints - trip organizers, ignored
        const orgIgnoredCount = await complaintModel.count({
            where: {
                category: "trip organizers",
                status: "ignored"
            }
        });

        // if there are no complaints display a message and exit
        if (orgComplaintsIgnored.length === 0) {
            res.status(200).send({
                message: "No ignored complaints found",
                count: orgIgnoredCount
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
                count: orgIgnoredCount,
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

// view system complaints - pending '$baseUrl/admin/systemComplaintsPending'
async function systemComplaintsPending(req, res) {
    try {
        // get all the complaints by category - system, pending
        const systemComplaintsPending = await complaintModel.findAll({
            where: {
                category: "system",
                status: "pending"
            },
            attributes: ['title','user_id']
        });

        // get the count of the complaints - system, pending
        const systemPendingCount = await complaintModel.count({
            where: {
                category: "system",
                status: "pending"
            }
        });

        // if there are no complaints display a message 
        if (systemComplaintsPending.length === 0) {
            res.status(200).send({
                message: "No pending complaints found",
                count: systemPendingCount
            });
        } else {
            res.status(200).send({
                message: "Pending complaints found successfully",
                count: systemPendingCount,
                pending: systemComplaintsPending
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// view system complaints - resolved '$baseUrl/admin/systemComplaintsResolved'
async function systemComplaintsResolved(req, res) {
    try {
                // get all the complaints by category - system, resolved
                const systemComplaintsResolved = await complaintModel.findAll({
                    where: {
                        category: "system",
                        status: "resolved"
                    },
                    attributes: ['title','user_id']
                });
        
                // get the count of the complaints - system, resolved
                const systemResolvedCount = await complaintModel.count({
                    where: {
                        category: "system",
                        status: "resolved"
                    }
                });
        
                // if there are no complaints display a message
                if (systemComplaintsResolved.length === 0) {
                    res.status(200).send({
                        message: "No resolved complaints found",
                        count: systemResolvedCount
                    });
                } else {
                    res.status(200).send({
                        message: "Resolved complaints found successfully",
                        count: systemResolvedCount,
                        resolved: systemComplaintsResolved
                    });
                }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// view system complaints - ignored '$baseUrl/admin/systemComplaintsIgnored'
async function systemComplaintsIgnored(req, res) {
    try {
                // get all the complaints by category - system, ignored
                const systemComplaintsIgnored = await complaintModel.findAll({
                    where: {
                        category: "system",
                        status: "ignored"
                    },
                    attributes: ['title','user_id']
                });
        
                // get the count of the complaints - system, ignored
                const systemIgnoredCount = await complaintModel.count({
                    where: {
                        category: "system",
                        status: "ignored"
                    }
                });
        
                // if there are no complaints display a message
                if (systemComplaintsIgnored.length === 0) {
                    res.status(200).send({
                        message: "No ignored complaints found",
                        count: systemIgnoredCount
                    });
                } else {
                    res.status(200).send({
                        message: "Ignored complaints found successfully",
                        count: systemIgnoredCount,
                        ignored: systemComplaintsIgnored
                    });
                }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// ignore complaint '$baseUrl/admin/ignoreComplaint/:id'
async function ignore(req, res) {
    const complaintId = req.params.id;
    try {
        const complaint = await complaintModel.findOne({
            where: {
                id: complaintId
            }
        });

        if (!complaint) {
            res.status(404).send({
                message: "Complaint not found"
            });
        }
        else {
            await complaint.update({
                status: "ignored"
            });
            res.status(200).send({
                message: "Complaint ignored successfully"
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// take action on complaint '$baseUrl/admin/actionComplaint/:id'
async function action(req, res) {
    const complaintId = req.params.id;
    try {
        const complaint = await complaintModel.findOne({
            where: {
                id: complaintId
            }
        });

        if (!complaint) {
            res.status(404).send({
                message: "Complaint not found"
            });
        }
        else {
            // take action according to the category
            switch (complaint.category) {

                case "post":
                    // delete the post
                    await postModel.destroy({
                        where: {
                            id: complaint.content_id
                        }
                    });

                    // update the complaint status
                    await complaint.update({
                        status: "resolved"
                    });

                    res.status(200).send({
                        message: "Complaint resolved successfully"
                    });
                    break;

                case "comment":
                    // delete the comment
                    await comment_postModel.destroy({
                        where: {
                            id: complaint.content_id
                        }
                    });

                    // update the complaint status
                    await complaint.update({
                        status: "resolved"
                    });

                    res.status(200).send({
                        message: "Complaint resolved successfully"
                    });
                    break;

                case "user":
                    // diable user accounts
                    await userModel.update({
                        active: false
                    }, {
                        where: {
                            id: complaint.content_id
                        }
                    });

                    // update the complaint status
                    await complaint.update({
                        status: "resolved"
                    });

                    res.status(200).send({
                        message: "Complaint resolved successfully"
                    });
                    break;

                case "trip organizers":
                    // diable user accounts
                    await userModel.update({
                        active: false
                    }, {
                        where: {
                            id: complaint.content_id
                        }
                    });

                    // update the complaint status
                    await complaint.update({
                        status: "resolved"
                    });

                    res.status(200).send({
                        message: "Complaint resolved successfully"
                    });
                    break;

                default:
                    // update the complaint status
                    await complaint.update({
                        status: "resolved"
                    });

                    res.status(200).send({
                        message: "Complaint resolved successfully"
                    });
                    break;
            }
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}



// *** User Management ***
// view users '$baseUrl/admin/viewUsers'
async function viewUsers(req, res) {
    const user = [];

    try {
        const users = await userModel.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email']
        });

        for (let i = 0; i < users.length; i++) {
            // get user's name = firstName + lastName
            users[i].name = users[i].firstName + " " + users[i].lastName;
            console.log(users[i].name); 

            // get account type 
            switch (users[i].id) {
                case travel_guideModel.user_id:
                    var account_type = "travel guide";
                    break;
                case service_providerModel.user_id:
                    var account_type = "service provider";
                    break;
                case vendorModel.user_id:
                    var account_type = "vendor";
                    break;
                default:
                    var account_type = "traveler";
                    break;
            }

            // user details (id, name, email, account_type) 
            user.push(users[i].id);
            user.push(users[i].name);
            user.push(users[i].email);
            user.push(account_type); 
        }

        res.status(200).send({
            message: "Users found successfully",
            users: user
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// view user details '$baseUrl/admin/viewUser/:id'
async function viewUser(req, res) {
    try {
        const user = await userModel.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) {
            res.status(404).send({
                message: "User not found"
            });
        } else {
            // get the no of trip planned by the user
            const trips = await tripModel.count({
                where: {
                    user_id: user.id
                }
            });

            // get the no of posts by the user
            const posts = await postModel.count({
                where: {
                    userID: user.id
                }
            });

            // get the no of complaints to the user
            const complaints = await complaintModel.count({
                where: {
                    content_id: user.id
                }
            });

            // overall user details
            const user_details = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phoneNo: user.phoneNo,
                birthday: user.birthday,
                gender: user.gender,
                acc_created: user.createdAt,
                trips: trips,
                posts: posts,
                complaints: complaints
            }

            res.status(200).send({
                message: "User found successfully",
                user: user_details
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// disable user '$baseUrl/admin/disableUser/:id'
async function disableUser(req, res) {
    try {
        const user = await userModel.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) {
            res.status(404).send({
                message: "User not found"
            });
        }
        else {
            await user.update({
                active: false
            });
            res.status(200).send({
                message: "User Account disabled successfully"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// delete user '$baseUrl/admin/deleteUser/:id'
async function deleteUser(req, res) {
    try {
        const user = await userModel.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) {
            res.status(404).send({
                message: "User not found"
            });
        } else {
            await user.destroy();
            res.status(200).send({
                message: "User Account deleted successfully"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// sort users by name - asc '$baseUrl/admin/users/sortBYName'
async function sortByName(req, res) {
    const user = [];

    try {
        const users = await userModel.findAll({
            order: [
                ['firstName', 'ASC']
            ],
            attributes: ['id', 'firstName', 'lastName', 'email']
        });

        for (let i = 0; i < users.length; i++) {
            // get user's name = firstName + lastName
            users[i].name = users[i].firstName + " " + users[i].lastName;
            console.log(users[i].name); 

            // get account type 
            switch (users[i].id) {
                case travel_guideModel.user_id:
                    var account_type = "travel guide";
                    break;
                case service_providerModel.user_id:
                    var account_type = "service provider";
                    break;
                case vendorModel.user_id:
                    var account_type = "vendor";
                    break;
                default:
                    var account_type = "traveler";
                    break;
            }

            // user details (id, name, email, account_type) 
            user.push(users[i].id);
            user.push(users[i].name);
            user.push(users[i].email);
            user.push(account_type); 
        }

        res.status(200).send({
            message: "Users sorted successfully",
            users: user
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// sort users by number of trips '$baseUrl/admin/users/sort/trips'
async function sortByTrips(req, res) {
    try {
        // get the number of trips planned by each user and sort them
        const plannedTrips = await tripModel.findAll({
            attributes: ['user_id', [sequelize.fn('COUNT', sequelize.col('user_id')), 'trips']],
            group: ['user_id'],
            order: [
                [sequelize.literal('COUNT(user_id)'), 'DESC']
            ]
        });

        // get the user details
        const user = [];

        for (let i = 0; i < plannedTrips.length; i++) {
            const user_details = await userModel.findOne({
                where: {
                    id: plannedTrips[i].user_id
                },
                attributes: ['id', 'firstName', 'lastName', 'email']
            });

            // concat user's name
            user_details.name = user_details.firstName + " " + user_details.lastName;

            // get user account type
            switch (user_details.id) {
                case travel_guideModel.user_id:
                    var account_type = "travel guide";
                    break;
                case service_providerModel.user_id:
                    var account_type = "service provider";
                    break;
                case vendorModel.user_id:
                    var account_type = "vendor";
                    break;
                default:
                    var account_type = "traveler";
                    break;
            }

            // user details (id, name, email, account_type)
            user.push(user_details.id);
            user.push(user_details.name);
            user.push(user_details.email);
            user.push(account_type); 
        }

        res.status(200).send({
            message: "Users sorted successfully",
            trips: plannedTrips,
            users: user
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// filter users by role '$baseUrl/admin/users/filter/:role'
async function filterByRole(req, res) {
    try {
        // get the role
        const role = req.params.role;

        switch (role) {
            case "guide":
                // get travel guides
                const travel_guides = await travel_guideModel.findAll({
                    attributes: ['user_id'],
                    where: {
                        status: 1
                    },
                    include: [{
                        model: userModel,
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }]
                });

                // if there are no travel guides display a message
                if (travel_guides.length === 0) {
                    res.status(200).send({
                        message: "No travel guides found"
                    });
                } else {
                    // get the user details
                    const user = [];

                    for (let i = 0; i < travel_guides.length; i++) {
                        // concat user's name
                        travel_guides[i].user.name = travel_guides[i].user.firstName + " " + travel_guides[i].user.lastName;

                        // user details (id, name, email)
                        user.push(travel_guides[i].user.id);
                        user.push(travel_guides[i].user.name);
                        user.push(travel_guides[i].user.email);
                        user.push('travel guide');
                    }

                    res.status(200).send({
                        message: "Travel guides found successfully",
                        users: user
                    });
                }
                break;

            case "provider":
                // get service providers
                const service_providers = await service_providerModel.findAll({
                    attributes: ['user_id'],
                    where: {
                        status: 1
                    },
                    include: [{
                        model: userModel,
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }]
                });

                // if there are no service providers display a message
                if (service_providers.length === 0) {
                    res.status(200).send({
                        message: "No service providers found"
                    });
                } else {
                    // get the user details
                    const user = [];

                    for (let i = 0; i < service_providers.length; i++) {
                        // concat user's name
                        service_providers[i].user.name = service_providers[i].user.firstName + " " + service_providers[i].user.lastName;

                        // user details (id, name, email)
                        user.push(service_providers[i].user.id);
                        user.push(service_providers[i].user.name);
                        user.push(service_providers[i].user.email);
                        user.push('service provider');
                    }

                    res.status(200).send({
                        message: "Service providers found successfully",
                        users: user
                    });
                }
                break;

            case "vendor":
                // get vendors
                const vendors = await vendorModel.findAll({
                    attributes: ['user_id'],
                    where: {
                        status: 1
                    },
                    include: [{
                        model: userModel,
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }]
                });

                // if there are no vendors display a message
                if (vendors.length === 0) {
                    res.status(200).send({
                        message: "No vendors found"
                    });
                } else {
                    // get the user details
                    const user = [];

                    for (let i = 0; i < vendors.length; i++) {
                        // concat user's name
                        vendors[i].user.name = vendors[i].user.firstName + " " + vendors[i].user.lastName;

                        // user details (id, name, email)
                        user.push(vendors[i].user.id);
                        user.push(vendors[i].user.name);
                        user.push(vendors[i].user.email);
                        user.push('vendor');
                    }

                    res.status(200).send({
                        message: "Vendors found successfully",
                        users: user
                    });
                }
                break;

            default:
                // get travelers
                const travelers = await userModel.findAll({
                    where: {
                        active: true
                    },
                    attributes: ['id', 'firstName', 'lastName', 'email']
                });

                // if there are no travelers display a message
                if (travelers.length === 0) {
                    res.status(200).send({
                        message: "No travelers found"
                    });
                } else {
                    // get the user details
                    const user = [];

                    for (let i = 0; i < travelers.length; i++) {
                        // concat user's name
                        travelers[i].name = travelers[i].firstName + " " + travelers[i].lastName;

                        // user details (id, name, email)
                        user.push(travelers[i].id);
                        user.push(travelers[i].name);
                        user.push(travelers[i].email);
                        user.push('traveler');
                    }

                    res.status(200).send({
                        message: "Travelers found successfully",
                        users: user
                    });
                }
                break;
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}


// *** Handle Profile upgrade ***
// view profile upgrade requests '$baseUrl/admin/profileUpgradeRequests'
async function profileUpgradeRequests(req, res) {
    try {
        const travel_guide = await travel_guideModel.findAll({
            where: {
                status: 0
            }
        });

        const service_provider = await service_providerModel.findAll({
            where: {
                status: 0
            }
        });

        const vendor = await vendorModel.findAll({
            where: {
                status: 0
            }
        });

        // if there are no requests display a message
        if (!travel_guide && !service_provider && !vendor) {
            res.status(200).send({
                message: "No profile upgrade requests found"
            });
        } else {
            // if there are requests, get the details of the user who requested
            const guide = [];
            const provider = [];
            const user = []; // for vendors

            // get travel guide details
            for (let i = 0; i < travel_guide.length; i++) {
                const user_details = await userModel.findOne({
                    where: {
                        id: travel_guide[i].user_id
                    },
                    attributes: ['id', 'firstName', 'lastName', 'email']
                });

                // concat user's name
                user_details.name = user_details.firstName + " " + user_details.lastName;

                // user details (id, name, email)
                guide.push(user_details.id);
                guide.push(user_details.name);
                guide.push(user_details.email);
            }

            // get service provider details
            for (let i = 0; i < service_provider.length; i++) {
                const user_details = await userModel.findOne({
                    where: {
                        id: service_provider[i].user_id
                    },
                    attributes: ['id', 'firstName', 'lastName', 'email']
                });

                // concat user's name
                user_details.name = user_details.firstName + " " + user_details.lastName;

                // user details (id, name, email)
                provider.push(user_details.id);
                provider.push(user_details.name);
                provider.push(user_details.email);
            }

            // get vendor details
            for (let i = 0; i < vendor.length; i++) {
                const user_details = await userModel.findOne({
                    where: {
                        id: vendor[i].user_id
                    },
                    attributes: ['id', 'firstName', 'lastName', 'email']
                });

                // concat user's name
                user_details.name = user_details.firstName + " " + user_details.lastName;

                // user details (id, name, email)
                user.push(user_details.id);
                user.push(user_details.name);
                user.push(user_details.email);
            }

            res.status(200).send({
                message: "Profile upgrade requests found successfully",
                travel_guide: guide,
                service_provider: provider,
                vendor: user
            });

        }

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error'
        });
    }
}

// approve profile upgrade request '$baseUrl/admin/approveProfileUpgrade/:id'
async function approveRequest(req, res) {
    try {
        // get the user id
        const user_id = req.params.id;

        switch (user_id) {
            case travel_guideModel.user_id:
                // update the status of the travel guide
                await travel_guideModel.update({
                    status: 1
                }, {
                    where: {
                        user_id: user_id
                    }
                });
                res.status(200).send({
                    message: "Profile upgrade request approved successfully"
                });
                break;

            case service_providerModel.user_id:
                // update the status of the service provider
                await service_providerModel.update({
                    status: 1
                }, {
                    where: {
                        user_id: user_id
                    }
                });
                res.status(200).send({
                    message: "Profile upgrade request approved successfully"
                });
                break;

            case vendorModel.user_id:
                // update the status of the vendor
                await vendorModel.update({
                    status: 1
                }, {
                    where: {
                        user_id: user_id
                    }
                });
                res.status(200).send({
                    message: "Profile upgrade request approved successfully"
                });
                break;

            default:
                res.status(404).send({
                    message: "User not found"
                });
                break;
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}

// reject profile upgrade request '$baseUrl/admin/rejectProfileUpgrade/:id'
async function rejectRequest(req, res) {
    try {
        // get the user id
        const user_id = req.params.id;

        switch (user_id) {
            case travel_guideModel.user_id:
                // update the status of the travel guide
                await travel_guideModel.update({
                    status: 2
                }, {
                    where: {
                        user_id: user_id
                    }
                });
                res.status(200).send({
                    message: "Profile upgrade request rejected successfully"
                });
                break;

            case service_providerModel.user_id:
                // update the status of the service provider
                await service_providerModel.update({
                    status: 2
                }, {
                    where: {
                        user_id: user_id
                    }
                });
                res.status(200).send({
                    message: "Profile upgrade request rejected successfully"
                });
                break;

            case vendorModel.user_id:
                // update the status of the vendor
                await vendorModel.update({
                    status: 2
                }, {
                    where: {
                        user_id: user_id
                    }
                });
                res.status(200).send({
                    message: "Profile upgrade request rejected successfully"
                });
                break;

            default:
                res.status(404).send({
                    message: "User not found"
                });
                break;
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server error"
        });
    }
}


// *** Admin Panel ***



module.exports = {
    AdminRegister,
    AdminLogin,
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
    systemComplaintsPending,
    systemComplaintsResolved,
    systemComplaintsIgnored,
    ignore,
    action,
    viewUsers,
    viewUser,
    disableUser,
    deleteUser,
    sortByName,
    sortByTrips,
    filterByRole,
    profileUpgradeRequests,
    approveRequest,
    rejectRequest
};