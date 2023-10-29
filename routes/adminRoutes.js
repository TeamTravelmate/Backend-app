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
    systemComplaintsPending,
    systemComplaintsResolved,
    systemComplaintsIgnored,
    ignore,
    action,
    viewUsers,
    disableUser,
    deleteUser,
    sortByName,
    sortByTrips,
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

// view system related complaints
router.get('/systemComplaintsPending', validateUser, systemComplaintsPending);
router.get('/systemComplaintsResolved', validateUser, systemComplaintsResolved);
router.get('/systemComplaintsIgnored', validateUser, systemComplaintsIgnored);

// ignore complaint
router.put('/ignoreComplaint/:id', validateUser, ignore);

// take action on complaint
router.put('/actionComplaint/:id', validateUser, action);


// *** User Management ***
// view all users
router.get('/viewUsers', validateUser, viewUsers);

// disable user
router.put('/disableUser/:id', validateUser, disableUser);

// delete user
router.delete('/deleteUser/:id', validateUser, deleteUser);

// sort users
router.get('/users/sortByName', validateUser, sortByName);
router.get('/users/sortByTrips', validateUser, sortByTrips);

module.exports = router;