const { response } = require('express');
const { capitalizeFirst } = require('../helpers/capitalizeFirstLetter');
const{
    vendor_essential: vendor_essentialModel,
    product_details: product_detailsModel,
    cart: cartModel,
    delivery_method: delivery_methodModel,
    shipping_details: shipping_detailsModel,
    order: orderModel,
    sequelize
} = require('../models');
const { Op } = require('sequelize');

//***$baseUrl/vendor***
//give all sales products '$baseUrl/vendor/products'
async function getAllProducts(req, res){
    try{
        const products = await product_detailsModel.findAll({
            include: [{
                model: vendor_essentialModel,
                on: sequelize.literal('vendor_essential.id = product_details.vendor_essential_id'),
                attributes: ['id','category','assential_name','user_id','description']
            }],
            attributes: ['id','price','quantity','colour','size']
        })

        // const product_details = products.map(product => {
        //     return {
        //         id: product.id,
        //         price: product.price,
        //         quantity: product.quantity,
        //         colour: product.colour,
        //         size: product.size,
        //         // photo: product.photo,
        //         vendor_essential_id: product.vendor_essential_id
        //     }
        // })

        res.status(200).send({
            products: products
        });
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

        if (products.length === 0){
            res.status(404).send({
                message: "No products found"
            })
        }

        const category_products = products.map(product => product.id);

        const product_details = await product_detailsModel.findAll({
            where: {
                vendor_essential_id: category_products
            },
            include: [{
                model: vendor_essentialModel,
                on: sequelize.literal('vendor_essential.id = product_details.vendor_essential_id'),
                attributes: ['assential_name','user_id','description']
            }]
        })

        res.status(200).send(product_details);
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
        const userID = req.user.userId;
        const products = await vendor_essentialModel.findAll({
            where: {
                user_id : userID
            }
        })

        if (products.length === 0) {
            response.status(404).send({
                message: "No products found"
            });
        }

        const my_products = products.map(product => product.id);

        const product_details = await product_detailsModel.findAll({
            where: {
                vendor_essential_id: my_products
            },
            include: [{
                model: vendor_essentialModel,
                on: sequelize.literal('vendor_essential.id = product_details.vendor_essential_id'),
                attributes: ['assential_name','description']
            }]
        })

        res.status(200).send(product_details);
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
        const product = await product_detailsModel.findOne({
            where: {
                id : productID
            },
            include: [{
                model: vendor_essentialModel,
                on: sequelize.literal('vendor_essential.id = product_details.vendor_essential_id'),
                attributes: ['assential_name','description']

            }]
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
    try {
        const {
            category,
            assential_name,
            description,
            product_details
        } = req.body;
        const userID = req.user.userId;
        const new_product_details = [];

        const newProduct = await vendor_essentialModel.create({
            category: category,
            assential_name: assential_name,
            description: description,
            user_id: userID
        });

        for (const details of product_details) {
            let {
                price,
                quantity,
                colour,
                size
                // photo
            } = details;

        const product_detail = await product_detailsModel.create({
            price: price,
            quantity: quantity,
            colour: colour,
            size: size,
            // photo: photo,
            vendor_essential_id: newProduct.id
        });

        new_product_details.push(product_detail);
    }
         
    res.status(201).send({
        message: "Product added successfully!",
        vendor_essential: newProduct,
        product_details: new_product_details
    });

    } catch (err) {
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
        quantity
    } = req.body;

    try{
        const productID = req.params.id;
        const product = await product_detailsModel.update({
                price: price,
                quantity: quantity
            },{
                where: {
                    id : productID
                }
            });
            if (product[0] === 0){
                res.status(404).send({
                    message: "Product not found"
                })
            } else {
                res.status(200).send({
                    message: "Product updated successfully!",
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
        const product = await product_detailsModel.destroy({
            where: {
                id : productID
            }
        })

        if (product === 0) {
            res.status(404).send({
                message: "Product not found"
            })
        } else {
            res.status(200).send({
                message: "Product deleted successfully!",
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

//add delivery method '$baseUrl/vendor/addDeliveryMethod'
async function addDeliveryMethod(req, res){
    const userID = req.user.userId;
    const {
        delivery_method
    } = req.body;

    try {
        const delivery = await delivery_methodModel.create({
            delivery_method: delivery_method,
            user_id: userID
        });

        res.status(201).send({
            message: "Delivery method added successfully!",
            delivery_method: delivery
        });

    } catch (err) {
        res.status(500).send({
            message: "Server Error!"
        })
    }
}

//view delivery method '$baseUrl/vendor/viewDeliveryMethod'
async function viewDeliveryMethod(req, res){
    const userID = req.user.userId;

    try{
        const delivery = await delivery_methodModel.findAll({
            where: {
                user_id : userID
            },
            attributes: ['id','delivery_method']
        })

        if (delivery.length === 0){
            res.status(404).send({
                message: "No delivery method found!"
            });
        } else {
            res.status(200).send(delivery);
        }
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//delete delivery method '$baseUrl/vendor/deleteDeliveryMethod/:id'
async function deleteDeliveryMethod(req, res){
    const deliveryID = req.params.id;
    const userID = req.user.userId;

    try {
        const delivery = await delivery_methodModel.destroy({
            where: {
                id : deliveryID,
                user_id : userID
            }
        })

        if (delivery === 0){
            res.status(404).send({
                message: "Delivery method not found!"
            });
        } else {
            res.status(200).send({
                message: "Delivery method deleted successfully!",
                delivery_method: delivery
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//add to cart '$baseUrl/vendor/addToCart/:id'
async function addToCart(req, res){
    const productID = req.params.id;
    const userID = req.user.userId;
    let {
        Quantity
    } = req.body;

    try{
        const product = await product_detailsModel.findOne({
            where: {
                id : productID
            }
        })

            // check product availability
            if (product.quantity < Quantity){
                res.status(404).send({
                    message: "Product not available!"
                });
            } else {
                // 1. add product to cart 
                const cart = await cartModel.create({
                    product_id: productID,
                    quantity: Quantity, 
                    product_amount: product.price,
                    traveler_id: userID,
                    vendor_id: product.user_id
                });

                // 2. update quantity of product in product_details table 
                const productToCart = await product_detailsModel.update({
                    quantity: product.quantity - Quantity
                },{
                    where: {
                        id : productID
                    }
                });

            res.status(201).send({
                message: "Product added to cart successfully!",
                product: product,
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
    const userID = req.user.userId; 
    const cart_items = []; 
    const cart_product_details = []; 
    const my_cart = [];

    try{
        const cart = await cartModel.findAll({
            where: {
                traveler_id : userID
            },
            attributes: ['id','quantity','product_amount','vendor_id','product_id']
        })

        if (cart.length === 0){
            res.status(404).send({
                message: "Cart is empty!"
            });
        } else {
            cart_items.push(cart);
            
            const cart_products = cart.map(product => product.product_id);

            const products = await product_detailsModel.findAll({
                where: {
                    id: cart_products
                },
                as: 'product_details',
                attributes: ['colour','size','photo'],
                include: [{
                    model: vendor_essentialModel,
                    on: sequelize.literal('vendor_essential.id = product_details.vendor_essential_id'),
                    attributes: ['assential_name','description']
                }]
            })
            cart_product_details.push(products);

            for (let i = 0; i < cart_items.length; i++) {
                for (let j = 0; j < cart_product_details[i].length; j++) {
                  const product = cart_items[i][j];
                  const productDetails = cart_product_details[i][j];
              
                  my_cart.push({
                    product,
                    productDetails,
                  });
                }
              }
            //   console.log(my_cart);
            res.status(200).send(my_cart);
        }
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//update quantity of the product in cart '$baseUrl/vendor/updateCart/:id'
async function updateCart(req, res){
    try{
        const productID = req.params.id;
        const userID = req.user.userId;
        let {
            Quantity
        } = req.body;

        const product = await cartModel.findOne({
            where: {
                id : productID,
                traveler_id : userID
            }
        })

        const updateProduct = await product_detailsModel.findOne({
            where: {
                id : product.product_id
            }
        });

        //check product availability
        if (updateProduct.quantity === 0 || updateProduct.quantity < Quantity){
            res.status(404).send({
                message: "Product not available!"
            });
        } else {
            // store the current quantity of product in cart
            const quantity = product.quantity;

            // 1. update quantity of product in cart 
            product.quantity = Quantity;
            await product.save();

            // 2. update quantity of product in product_details table 
            updateProduct.quantity = updateProduct.quantity - (Quantity - quantity);
            await updateProduct.save();

        res.status(201).send({
            message: "Product quantity updated successfully!"
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
        const userID = req.user.userId;

        const removeProduct = await cartModel.findOne({
            where: {
                id : productID,
                traveler_id : userID
            }
        })

        const product = await product_detailsModel.findOne({
            where: {
                id : removeProduct.product_id
            }
        });

        // 1. remove product from cart 
        await removeProduct.destroy();

        // 2. update quantity of product in product_details table 
        product.quantity = product.quantity + removeProduct.quantity;
        await product.save();

        res.status(201).send({
            message: "Product removed from cart successfully!",
            removedProduct: removeProduct
        });
        
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//add name, shipping address, phone number '$baseUrl/vendor/addShippingAddress'
async function addShippingDetails(req, res) {
    const userID = req.user.userId;
    const {
        name,
        phone_number,
        house_number,
        street,
        city,
        state,
        country,
        zip_code
    } = req.body;

    try {
        const shipping = await shipping_detailsModel.create({
            name: name,
            phone_number: phone_number,
            house_number: house_number,
            street: street,
            city: city,
            state: state,
            country: country,
            zip_code: zip_code,
            user_id: userID
        });

        res.status(201).send({
            message: "Shipping details added successfully!",
            shipping_details: shipping
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        })
    }
}

//delete name, shipping address, phone number '$baseUrl/vendor/deleteShippingAddress/:id'
async function deleteShippingDetails(req, res){
    const shippingID = req.params.id;
    const userID = req.user.userId;

    try {
        const shipping = await shipping_detailsModel.destroy({
            where: {
                id : shippingID,
                user_id : userID
            }
        })

        if (!shipping){
            res.status(404).send({
                message: "Shipping details not found!"
            });
        } else {
            res.status(200).send({
                message: "Shipping details deleted successfully!",
                shipping_details: shipping
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//view my shipping address '$baseUrl/vendor/myShippingAddress'
async function myShippingDetails(req, res){
    const userID = req.user.userId;

    try{
        const shipping = await shipping_detailsModel.findAll({
            where: {
                user_id : userID
            },
            attributes: ['name','phone_number','house_number','street','city','state','country','zip_code']
        })

        if (shipping.length === 0){
            res.status(404).send({
                message: "No shipping details found!"
            });
        } else {
            res.status(200).send(shipping);
        }
    } catch (err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//checkout '$baseUrl/vendor/checkout'

//my orders - vendor '$baseUrl/vendor/myOrders'
async function getMyOrders(req, res){
    try{
        const orders = await orderModel.findAll({
            where: {
                user_id: userID
            },
            include: [{
                model: cartModel,
                on: sequelize.literal('cart.id = order.cart_id'),
                attributes: ['id','quantity','product_amount']
            }],
            attributes: ['id,','user_id']
        })
        res.status(200).send(orders);
    } catch(err){
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//clear cart items after checkout '$baseUrl/vendor/clearCart/:id'
async function clearCart(req, res){
    const userID = req.user.userId
    try{
        const cart = await cartModel.destroy({
            where: {
                user_id: userID
            }
        })
        if(!cart) {
            res.status(404).send({
                message: "Cart details not found!"
            });
        }
        else {
            res.status(200).send({
                message: "Cart cleared successfully!",
                cart : cart
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send({
            message: "Server Error!"
        });
    }
}

//view my orders - traveller  '$baseUrl/vendor/myOrders/:user_id'




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
    myShippingDetails
}