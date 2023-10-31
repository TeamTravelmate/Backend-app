const {
    activity: activityModel,
} = require('../models');

async function getActivityByName(activity) {
  try {
    const ActivityData = await activityModel.findOne({
      where: { activity_name: activity }
    });
    if(ActivityData === null){
      const newActivity = await activityModel.create({
        activity_name: activity
      });
      return newActivity;
    }
    return ActivityData;
  } catch (error) {
    console.error('Error retrieving activity:', error);
    throw error;
  }
}

module.exports = {
  getActivityByName
};