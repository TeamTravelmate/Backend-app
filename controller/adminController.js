const {
    User:userModel,
    post: postModel,
    comment_post: comment_postModel,
    complaint: complaintModel,
    sequelize
} = require('../models');

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



// *** User Management ***
// view users '$baseUrl/admin/users'

// disable user '$baseUrl/admin/disableUser/:id'

// delete user '$baseUrl/admin/deleteUser/:id'

// sort users by alphabetical order '$baseUrl/admin/users/sort'

// sort users by number of posts '$baseUrl/admin/users/sort/posts'

// sort users by number of comments '$baseUrl/admin/users/sort/comments'

// sort users by number of complaints '$baseUrl/admin/users/sort/complaints'

// sort users by number of trips '$baseUrl/admin/users/sort/trips'

// filter users by role '$baseUrl/admin/users/filter/role'


// *** Admin Panel ***


module.exports = {
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
    ignore
};