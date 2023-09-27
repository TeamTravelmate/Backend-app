const { capitalizeFirst } = require('../helpers/capitalizeFirstLetter');
const{
    vendor_essential: vendor_essentialModel,
    sequelize
} = require('../models');


//give all sales products
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


//add a new product to the market place
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
        const sellername = req.user.firstName + req.user.lastName;

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