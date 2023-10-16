const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const {
    getAllProducts,
    getProductsByCategory,
    myProducts,
    getProduct,
    addProduct,
    editProduct,
    deleteProduct,
    addToCart,
    myCart,
    updateCart,
    removeFromCart
} =  require('../controller/vendorController');

router.get('/products', validateUser, getAllProducts);
router.get('/category/:category', validateUser, getProductsByCategory);

router.get('/myProducts', validateUser, myProducts);

router.get('/product/:id', validateUser, getProduct);
router.post('/addProduct', validateUser, addProduct);
router.put('/editProduct/:id', validateUser, editProduct);
router.delete('/deleteProduct/:id', validateUser, deleteProduct);

router.post('/addToCart/:id', validateUser, addToCart);
router.get('/myCart',validateUser, myCart);
router.put('/updateCart/:id', validateUser, updateCart);
router.delete('/removeFromCart/:id', validateUser, removeFromCart);

module.exports = router;