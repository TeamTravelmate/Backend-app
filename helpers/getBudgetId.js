const {trip, budget} = require('../models');

trip.hasOne(budget, {
    foreignKey: 'tripID',
});

async function getTripBudgetId(tripId){
    const thisBudget =  await trip.findByPk(tripId, {include: budget});
    return thisBudget.budget.id;
}

module.exports = {getTripBudgetId,};