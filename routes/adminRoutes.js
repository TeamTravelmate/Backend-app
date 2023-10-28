const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const {
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
} =  require('../controller/adminController');

// ***handle complaints***
// view complaint
router.get('/viewComplaint/:id', validateUser, viewComplaint);

// view post related complaints
router.get('/postComplaintsPending', validateUser, postComplaintsPending);
router.get('/postComplaintsResolved', validateUser, postComplaintsResolved);
router.get('/postComplaintsIgnored', validateUser, postComplaintsIgnored);

// view comment related complaints
router.get('/commentComplaintsPending', validateUser, commentComplaintsPending);
router.get('/commentComplaintsResolved', validateUser, commentComplaintsResolved);
router.get('/commentComplaintsIgnored', validateUser, commentComplaintsIgnored);

// view user related complaints
router.get('/userComplaintsPending', validateUser, userComplaintsPending);
router.get('/userComplaintsResolved', validateUser, userComplaintsResolved);
router.get('/userComplaintsIgnored', validateUser, userComplaintsIgnored);

// view trip organizers related complaints
router.get('/orgComplaintsPending', validateUser, orgComplaintsPending);
router.get('/orgComplaintsResolved', validateUser, orgComplaintsResolved);
router.get('/orgComplaintsIgnored', validateUser, orgComplaintsIgnored);

module.exports = router;