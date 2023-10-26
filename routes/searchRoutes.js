const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const {
    search,
    searchUsers,
    searchLocations,
    searchActivities,
    searchProducts,
    searchMyProducts
} = require('../controller/searchController');

router.get('/', validateUser, search);
router.get('/users', validateUser, searchUsers);
router.get('/locations', validateUser, searchLocations);
router.get('/activities', validateUser, searchActivities);
router.get('/products', validateUser, searchProducts);
router.get('/myProducts', validateUser, searchMyProducts);

module.exports = router;