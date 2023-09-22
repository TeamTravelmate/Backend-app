const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const { 
    location : locationModel ,
    activity: activityModel,
    User:userModel,
    sequelize
} = require('../models');
const { Op } = require('sequelize');

//get - search for locations, activities and users
router.get('/', validateUser, async (req, res) => {
  const {
    userQuery
  } = req.query;

  try {
    const locations = await locationModel.findAll({
      where: { 
        city: { [Op.iLike]: `${userQuery}%` } 
      }
    })

    const activities = await activityModel.findAll({
      where: { 
        activity_name: { [Op.iLike]: `${userQuery}%` } 
      }
    })

    const users = await userModel.findAll({
      where: {
        firstName: { [Op.iLike]: `${userQuery}%` },
      }
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
});

//get - getting locations - search by location name
router.get('/locations', validateUser, async (req, res) => {
    const {
      city 
    } = req.query;

    try {
      const locations = await locationModel.findAll({
        where: { 
          city: { [Op.iLike]: `${city}%` } 
        }
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
  });

//get - getting all activities - search by activity name
router.get('/activities', validateUser, async (req, res) => {
    const {
        activity_name
    } = req.query;

    try {
        const activities = await activityModel.findAll({
            where: { activity_name: { [Op.iLike]: `${activity_name}%` }  },
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
});

  module.exports = router;
  