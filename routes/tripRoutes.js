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
  updateBudget,
  insertLocation,
  getLocation,
  updateLocation,
  deleteLocation,
  insertActivity,
  getActivity,
  updateActivity,
  createItinerary,
  getItinerary,
  updateItinerary,
  deleteItinerary,
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

//routes related to location
router.get('/location/:id', validateUser, getLocation);
router.post('/location', validateUser, insertLocation);
router.put('/location/:id', validateUser, updateLocation);
router.delete('/location/:id', validateUser, deleteLocation);

//rooutes related to activity
router.get('/activity/:id', validateUser, getActivity);
router.post('/activity', validateUser, insertActivity);
router.put('/activity/:id', validateUser, updateActivity);

//routes related to itinerary
router.get('/itinerary/:tripId', validateUser, getItinerary);
router.post('/itinerary', validateUser, createItinerary);
router.put('/itinerary/:tripId/:id', validateUser, updateItinerary);
router.delete('/itinerary/:tripId/:id', validateUser, deleteItinerary);

module.exports = router;