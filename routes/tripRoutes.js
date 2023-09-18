const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const {
    getPublicTrips,
    getUserTrips,
    getTripFromId,
    updateTrip,
    createTrip,
    createBudget,
    getBudget,
    updateBudget
  } = require('../controller/tripController');

// routes related to trips
router.get('/', getPublicTrips);
router.get('/myTrips', validateUser, getUserTrips);
router.get('/:tripId', getTripFromId);
router.post('/', validateUser, createTrip);
router.put('/', validateUser, updateTrip);

//routes related to budget
router.get('/budget/:tripId', getBudget);
router.post('/budget', validateUser, createBudget);
router.put('/budget', validateUser, updateBudget);

module.exports = router;