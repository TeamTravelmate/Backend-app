const router = require('express').Router();
const rateLimit = require("express-rate-limit"); 
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});
const validateAdmin = require('../middleware/validateAdmin');
const {
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
    disableUser,
    deleteUser,
    sortByName,
    sortByTrips,
} =  require('../controller/adminController');

// *** Admin Authentication ***
router.post('/register', loginLimiter, AdminRegister);
router.post('/login', loginLimiter, AdminLogin);

// ***handle complaints***
// view complaint
router.get('/viewComplaint/:id', validateAdmin, viewComplaint);

// view post related complaints
router.get('/postComplaintsPending', validateAdmin, postComplaintsPending);
router.get('/postComplaintsResolved', validateAdmin, postComplaintsResolved);
router.get('/postComplaintsIgnored', validateAdmin, postComplaintsIgnored);

// view comment related complaints
router.get('/commentComplaintsPending', validateAdmin, commentComplaintsPending);
router.get('/commentComplaintsResolved', validateAdmin, commentComplaintsResolved);
router.get('/commentComplaintsIgnored', validateAdmin, commentComplaintsIgnored);

// view user related complaints
router.get('/userComplaintsPending', validateAdmin, userComplaintsPending);
router.get('/userComplaintsResolved', validateAdmin, userComplaintsResolved);
router.get('/userComplaintsIgnored', validateAdmin, userComplaintsIgnored);

// view trip organizers related complaints
router.get('/orgComplaintsPending', validateAdmin, orgComplaintsPending);
router.get('/orgComplaintsResolved', validateAdmin, orgComplaintsResolved);
router.get('/orgComplaintsIgnored', validateAdmin, orgComplaintsIgnored);

// view system related complaints
router.get('/systemComplaintsPending', validateAdmin, systemComplaintsPending);
router.get('/systemComplaintsResolved', validateAdmin, systemComplaintsResolved);
router.get('/systemComplaintsIgnored', validateAdmin, systemComplaintsIgnored);

// ignore complaint
router.put('/ignoreComplaint/:id', validateAdmin, ignore);

// take action on complaint
router.put('/actionComplaint/:id', validateAdmin, action);


// *** User Management ***
// view all users
router.get('/viewUsers', validateAdmin, viewUsers);

// disable user
router.put('/disableUser/:id', validateAdmin, disableUser);

// delete user
router.delete('/deleteUser/:id', validateAdmin, deleteUser);

// sort users
router.get('/users/sortByName', validateAdmin, sortByName);
router.get('/users/sortByTrips', validateAdmin, sortByTrips);


module.exports = router;