const {
    location: locationModel,
} = require('../models');

async function getLocationByName(location) {
  try {
    const locationData = await locationModel.findOne({
      where: { name: location }
    });
    return locationData;
  } catch (error) {
    console.error('Error retrieving location:', error);
    throw error;
  }
}

module.exports = {
  getLocationByName
};