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



//*** Cart table 
//*** (Columns: product_id,quantity(by default quantity is 1),total_amount,traveler_id,vendor_id) 
//*** foreign keys:  product_id (vendor_essential table),traveler_id(User table),vendor_id(User table)

//add to cart '$baseUrl/vendor/addToCart/:id'
async function addToCart(req, res){
    try{
        const productID = req.params.id;
        const userID = req.user.userID;
        const product = await vendor_essentialModel.findOne({
            where: {
                id : productID
            }
        })

        //check product availability
        if (product.quantity === 0){
            res.status(404).send({
                message: "Product not available!"
            });
        } else {
            // 1. add product to cart 
            const cart = await cartModel.create({
                product_id: productID,
                quantity: quantity, //1 by default
                total_amount: product.price,
                traveler_id: userID,
                vendor_id: product.user_id
            });

            // 2. update quantity of product in vendor_essential table (quantity--)
            const product = await vendor_essentialModel.update({
                quantity: product.quantity - 1
            },{
                where: {
                    id : productID
                }
            });

        res.status(201).send({
            message: "Product added to cart successfully!",
            cart: cart
        });
    }
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//view my cart '$baseUrl/vendor/myCart'
async function myCart(req, res){
    try{
        const userID = req.user.userID;
        const cart = await cartModel.findAll({
            where: {
                traveler_id : userID
            },
            include: [{
                model: vendor_essentialModel,
                as: 'vendor_essential',
                attributes: ['assential_name', 'price', 'quantity', 'seller_name', 'address']
            }]
        })

        res.status(200).send(cart);
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//update quantity of the product in cart '$baseUrl/vendor/updateQuantityCart/:id'
async function updateQuantityCart(req, res){
    try{
        const productID = req.params.id;
        const userID = req.user.userID;
        const quantity = req.body.quantity;
        const product = await vendor_essentialModel.findOne({
            where: {
                id : productID
            }
        })

        //check product availability
        if (product.quantity === 0){
            res.status(404).send({
                message: "Product not available!"
            });
        } else {
            // 1. update quantity of product in cart 
            const cart = await cartModel.update({
                quantity: quantity,
                total_amount: product.price * quantity
            },{
                where: {
                    product_id : productID,
                    traveler_id : userID
                }
            });

            // 2. update quantity of product in vendor_essential table 
            const product = await vendor_essentialModel.update({
                quantity: product.quantity - quantity
            },{
                where: {
                    id : productID
                }
            });

        res.status(201).send({
            message: "Product quantity updated successfully!",
            cart: cart
        });
    }
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//remove from cart '$baseUrl/vendor/removeFromCart/:id'
async function removeFromCart(req, res){
    try{
        const productID = req.params.id;
        const userID = req.user.userID;
        const removeProduct = await cartModel.findOne({
            where: {
                id : productID
            }
        })

        // 1. remove product from cart 
        const cart = await cartModel.destroy({
            where: {
                product_id : productID,
                traveler_id : userID
            }
        });
        // 2. update quantity of product in vendor_essential table (accordding to the quantity in cart)
        const product = await vendor_essentialModel.update({
            quantity: product.quantity + removeProduct.quantity
        },{
            where: {
                id : productID
            }
        });

        res.status(201).send({
            message: "Product removed from cart successfully!",
            cart: cart
        });
        
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}



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