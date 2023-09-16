const {
    activity: activityModel,
} = require('../models');

async function getActivityByName(activity) {
  try {
    const ActivityData = await activityModel.findOne({
      where: { activity_name: activity }
    });
    return ActivityData;
  } catch (error) {
    console.error('Error retrieving activity:', error);
    throw error;
  }
}

module.exports = {
  getActivityByName
};