const { 
    location : locationModel ,
    activity: activityModel,
    User: userModel,
    vendor_essential: vendor_essentialModel,
    product_details: product_detailsModel,
    sequelize
} = require('../models');
const { Op } = require('sequelize');

//get - search for locations, activities and users
async function search (req,res) {
    const {
        userQuery
      } = req.query;
    
      try {
        const locations = await locationModel.findAll({
          where: { 
            city: { [Op.iLike]: `${userQuery}%` } 
          },
          attributes: ['name','city']
        })
    
        const activities = await activityModel.findAll({
          where: { 
            activity_name: { [Op.iLike]: `${userQuery}%` } 
          },
          attributes: ['activity_name'],
          include: [
            {
              model: locationModel,
              on: sequelize.literal('location.id = activity.lodation_id'),
              attributes: ['name','city'],
            //   required: true,
            }
          ]
        })
    
        const users = await userModel.findAll({
          where: {
            firstName: { [Op.iLike]: `${userQuery}%` },
          },
          attributes: ['firstName', 'lastName', 'username']
          // where: {
          //   [sequelize.Op.or]: [
          //     { firstName: { [sequelize.Op.iLike]: `${userQuery}%` } },
          //     { lastName: { [sequelize.Op.iLike]: `${userQuery}%` } },
          //   ],
          // },
        });

        // concat the first name and last name of the users
        const usersName = users.map(user => user.firstName + " " + user.lastName);

        // store the details of the users (name and username)
        const user = users.map((user, index) => {
            return {
                name: usersName[index],
                username: user.username
            }
        });
    
        if (!locations && !activities && !users) {
          res.status(404).send({
            message: "No results found"
          });
        } else {
          res.status(200).send({
            locations,
            activities,
            user
          });
        }
      } catch (err) { 
        console.log(err);
        res.status(500).send({
          message: "Server error"
        });
      }
}

//get - search for users
async function searchUsers (req,res) {
    const {
        userQuery
      } = req.query;
    
      try {
        const users = await userModel.findAll({
          where: {
            firstName: { [Op.iLike]: `${userQuery}%` },
          },
          attributes: ['firstName', 'lastName', 'username']
        });
    
        if (!users) {
          res.status(404).send({
            message: "No results found"
          });
        } else {
          // concat the first name and last name of the users
          const usersName = users.map(user => user.firstName + " " + user.lastName);

          // store the details of the users (name and email)
          const user = users.map((user, index) => {
              return {
                  name: usersName[index],
                  username: user.username
              }
          });

          res.status(200).send({
            users : user
          });
        }
      } catch (err) { 
        console.log(err);
        res.status(500).send({
          message: "Server error"
        });
      }
}

//get - getting locations - search by location name
async function searchLocations (req,res) {
    const {
        city 
      } = req.query;
  
      try {
        const locations = await locationModel.findAll({
          where: { 
            city: { [Op.iLike]: `${city}%` } 
          },
          attributes: ['name','city']
        })
      
        if (!locations) {
          res.status(404).send({
            message: "No locations found"
          });
        } else {
          res.status(200).send(locations);
        }
      } catch (err) {
        console.log(err);
        res.status(500).send({
          message: "Server error"
        });
      }
}

//get - getting all activities - search by activity name
async function searchActivities (req,res) {
    const {
        activity_name
    } = req.query;

    try {
        const activities = await activityModel.findAll({
            where: { activity_name: { [Op.iLike]: `${activity_name}%` }  },
            attributes: ['activity_name','description'],
            include: [
                {
                    model: locationModel,
                    on: sequelize.literal('location.id = activity.lodation_id'),
                    attributes: ['name','city'],
                    //   required: true,
                }   
            ]
        })
        if (!activities) {
            res.status(404).send({
              message: "No activities found"
            });
          } else {
            res.status(200).send(activities);
          }
    } catch (err) {
        console.log(err);
        res.status(500).send({
        message: "Server error"
      });
    }
}

//get - products - search by product_name
async function searchProducts (req, res) {
    const {
        assential_name
    } = req.query;

    try {
        const products = await vendor_essentialModel.findAll({
            where: { assential_name: { [Op.iLike]: `${assential_name}%` }  }
        })
        if (!products) {
            res.status(404).send({
              message: "No products found"
            });
          }

          const getProduct = products.map(product => product.id);
          const product_details = await product_detailsModel.findAll({
            where: {
              vendor_essential_id: getProduct
            },
            include: [{
                model: vendor_essentialModel,
                on: sequelize.literal('vendor_essential.id = product_details.vendor_essential_id'),
                attributes: ['assential_name','description','user_id']
            }],
            order: [
              ['id', 'DESC'],
            ]
          })
        res.status(200).send(product_details);
    } catch (err) {
        console.log(err);
        res.status(500).send({
        message: "Server error"
      });
    }
}



//search - myProducts by name
async function searchMyProducts (req, res) {
  const user_ID = req.user.userId;
  const {
    assential_name
  } = req.query;

try {
    const products = await vendor_essentialModel.findAll({
        where: { 
          user_id: user_ID,
          assential_name: { [Op.iLike]: `${assential_name}%` }  
        }
    })
    if (!products || products.length === 0) {
        res.status(404).send({
          message: "No products found"
        });
      }

      const getProduct = products.map(product => product.id);
      const product_details = await product_detailsModel.findAll({
        where: {
          vendor_essential_id: getProduct
        },
        include: [{
            model: vendor_essentialModel,
            on: sequelize.literal('vendor_essential.id = product_details.vendor_essential_id'),
            attributes: ['assential_name','description']
        }],
        order: [
          ['id', 'DESC'],
        ]
      })
    res.status(200).send(product_details);
} catch (err) {
    console.log(err);
    res.status(500).send({
    message: "Server error"
  });
}
}

module.exports = {
    search,
    searchUsers,
    searchLocations,
    searchActivities,
    searchProducts,
    searchMyProducts
};