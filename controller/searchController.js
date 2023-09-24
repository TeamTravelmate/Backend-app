const { 
    location : locationModel ,
    activity: activityModel,
    User:userModel,
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
    
        if (!locations && !activities && !users) {
          res.status(404).send({
            message: "No results found"
          });
        } else {
          res.status(200).send({
            locations,
            activities,
            users
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

module.exports = {
    search,
    searchLocations,
    searchActivities
};