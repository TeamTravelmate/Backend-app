const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const {
    search,
    searchLocations,
    searchActivities
} = require('../controller/searchController');

router.get('/', validateUser, search);
router.get('/locations', validateUser, searchLocations);
router.get('/activities', validateUser, searchActivities);

module.exports = router;