// controllers/tripController.js
const { CustomTrip, expenses} = require('../models');

const TripController = {
  createTrip: async (req, res) => {
    try {
      const {destination, startDate, numberOfDays, invitedFriends, userId } = req.body;

      const trip = await CustomTrip.create({
        destination,
        startDate,
        numberOfDays,
        invitedFriends,
        userId
      });

      res.status(201).json({status: true ,trip});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  createExpense: async (req, res) => {
    try {
      const { category, expense_name, amount, tripId } = req.body;

      const exp = await expenses.create({
        category,
        expense_name,
        amount,
        tripId
      });

      res.status(201).json(exp);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = TripController;
