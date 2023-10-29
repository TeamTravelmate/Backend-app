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
    addDeliveryMethod,
    viewDeliveryMethod,
    deleteDeliveryMethod,
    addToCart,
    myCart,
    updateCart,
    removeFromCart,
    addShippingDetails,
    deleteShippingDetails,
    myShippingDetails,
    myOrders,
    getVendorOrders,
    clearCart
} =  require('../controller/vendorController');

router.get('/products', validateUser, getAllProducts);
router.get('/category/:category', validateUser, getProductsByCategory);

router.get('/myProducts', validateUser, myProducts);

router.get('/product/:id', validateUser, getProduct);
router.post('/addProduct', validateUser, addProduct);
router.put('/editProduct/:id', validateUser, editProduct);
router.delete('/deleteProduct/:id', validateUser, deleteProduct);

router.post('/addDeliveryMethod', validateUser, addDeliveryMethod);
router.get('/viewDeliveryMethod', validateUser, viewDeliveryMethod);
router.delete('/deleteDeliveryMethod/:id', validateUser, deleteDeliveryMethod);

router.post('/addToCart/:id', validateUser, addToCart);
router.get('/myCart',validateUser, myCart);
router.put('/updateCart/:id', validateUser, updateCart);
router.delete('/removeFromCart/:id', validateUser, removeFromCart);

router.post('/addShippingDetails', validateUser, addShippingDetails);
router.delete('/deleteShippingDetails/:id', validateUser, deleteShippingDetails);
router.get('/myShippingDetails', validateUser, myShippingDetails);

router.get('/myOrders/:id', validateUser, myOrders);
router.get('/getVendorOrders', validateUser, getVendorOrders);
router.delete('/clearCart', validateUser, clearCart);

module.exports = router;