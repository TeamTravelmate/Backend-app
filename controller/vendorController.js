const { capitalizeFirst } = require('../helpers/capitalizeFirstLetter');
const{
    vendor_essential: vendor_essentialModel,
    sequelize
} = require('../models');
const { Op } = require('sequelize');

//***$baseUrl/vendor***
//give all sales products '$baseUrl/vendor/products'
async function getAllProducts(req, res){
    try{
        const products = await vendor_essentialModel.findAll({})
        res.status(200).send(products);
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//give products by category '$baseUrl/vendor/category/:category'
async function getProductsByCategory(req, res){
    try{
        const category = req.params.category;
        const products = await vendor_essentialModel.findAll({
            where: {
                category: { [Op.iLike]: `${category}%` }
            }
        })
        res.status(200).send(products);
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//give products by user '$baseUrl/vendor/myProducts'
async function myProducts(req, res) {
    try{
        const userID = req.params.userID;
        const products = await vendor_essentialModel.findAll({
            where: {
                //add user_id to vendor_essential table
                user_id : userID
            }
        })
        res.status(200).send(products);
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//get a product '$baseUrl/vendor/product/:id'
async function getProduct(req, res) {
    try{
        const productID = req.params.id;
        const product = await vendor_essentialModel.findOne({
            where: {
                id : productID
            }
        })
        res.status(200).send(product);
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//add a new product to the market place '$baseUrl/vendor/addProduct'
async function addProduct(req, res){
    try{
        let{
            category,
            name,
            price,
            quantity,
            address
        } = req.body;

        const userID = req.user.userID;
        const sellername = req.user.firstName + " " + req.user.lastName;

        category = capitalizeFirst(category);

        const newProduct = await vendor_essentialModel.create({
            category: category,
            assential_name: name,
            price: price,
            quantity: quantity,
            seller_name: sellername,
            address: address
        });
        res.status(201).send({
            message: "Product added successfully!",
            vendor_essential: newProduct
        });
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//edit a product '$baseUrl/vendor/editProduct/:id'
async function editProduct(req, res){
    let {
        price,
        quantity,
        address
    } = req.body;

    try{
        const productID = req.params.id;
        const product = await vendor_essentialModel.update({
                price: price,
                quantity: quantity,
                address: address
            },{
                where: {
                    id : productID
                }
            });
            if (product[0] === 0){
                res.status(404).send({
                    message: "Essential not found"
                })
            } else {
                res.status(200).send({
                    message: "Essential updated successfully!",
                    product: product
                });
            }
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//delete a product '$baseUrl/vendor/deleteProduct/:id'
async function deleteProduct(req, res){
    try{
        const productID = req.params.id;
        const product = await vendor_essentialModel.destroy({
            where: {
                id : productID
            }
        })

        if (product === 0) {
            res.status(404).send({
                message: "Essential not found"
            })
        } else {
            res.status(200).send({
                message: "Essential deleted successfully!",
                product: product
            });
        }
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//add to cart '$baseUrl/vendor/addToCart/:id'

//update quantity of product when a user add to cart & remove from cart '$baseUrl/vendor/updateQuantity/:id'

//remove from cart '$baseUrl/vendor/removeFromCart/:id'

//view my cart '$baseUrl/vendor/myCart'

//checkout '$baseUrl/vendor/checkout'

//clear cart items after checkout '$baseUrl/vendor/clearCart'

//add payment method '$baseUrl/vendor/addPaymentMethod'

//view my payment method '$baseUrl/vendor/myPaymentMethod'

//edit payment method '$baseUrl/vendor/editPaymentMethod/:id'

//add card details '$baseUrl/vendor/addCard'

//view card details '$baseUrl/vendor/myCardDetails'

//delete card details '$baseUrl/vendor/deleteCardDetails/:id'

//add delivery method '$baseUrl/vendor/addDeliveryMethod'

//add name, shipping address, phone number '$baseUrl/vendor/addShippingAddress'

//edit name, shipping address, phone number '$baseUrl/vendor/editShippingAddress/:id'

//delete name, shipping address, phone number '$baseUrl/vendor/deleteShippingAddress/:id'

//view my shipping address '$baseUrl/vendor/myShippingAddress'

//view my orders - delivered '$baseUrl/vendor/myOrders/delivered'

//view my orders - processing '$baseUrl/vendor/myOrders/processing'

//view my orders - cancelled '$baseUrl/vendor/myOrders/cancelled'

//track order '$baseUrl/vendor/trackOrder/:id'



//*** Products by category functions ***
//give all sales products in camp category
async function getCampProducts(req, res){
    try{
        const products = await vendor_essentialModel.findAll({
            where: {
                category: "Camping"
            }
        })
        res.status(200).send(products);
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//give all sales products in surfing category
async function getSurfProducts(req, res){
    try{
        const products = await vendor_essentialModel.findAll({
            where: {
                category: "Surfing"
            }
        })
        res.status(200).send(products);
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//give all sales products in hiking category
async function getHikeProducts(req, res){
    try{
        const products = await vendor_essentialModel.findAll({
            where: {
                category: "Hiking"
            }
        })
        res.status(200).send(products);
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}



module.exports = {
    getAllProducts,
    getProductsByCategory,
    myProducts,
    getProduct,
    addProduct,
    editProduct,
    deleteProduct
}