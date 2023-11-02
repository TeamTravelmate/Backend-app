const {
    location: locationModel,
} = require('../models');

async function getLocationByName(location) {
  try {
    const locationData = await locationModel.findOne({
      where: { name: location }
    });
    if(locationData === null){
      const newLocation = await locationModel.create({
        name: location
      });
      return newLocation;
    }
    return locationData;
  } catch (error) {
    console.error('Error retrieving location:', error);
    throw error;
  }
}

module.exports = {
  getLocationByName
};