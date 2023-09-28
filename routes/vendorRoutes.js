const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const {
    getAllProducts,
    getProductsByCategory,
    myProducts,
    getProduct,
    addProduct,
    editProduct,
    deleteProduct
} =  require('../controller/vendorController');

router.get('/products', validateUser, getAllProducts);
router.get('/category/:category', validateUser, getProductsByCategory);
router.get('/myProducts', validateUser, myProducts);
router.get('/product/:id', validateUser, getProduct);
router.post('/addProduct', validateUser, addProduct);
router.put('/editProduct/:id', validateUser, editProduct);
router.delete('/deleteProduct/:id', validateUser, deleteProduct);

module.exports = router;