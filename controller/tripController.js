// controllers/tripController.js
const { CustomTrip, expenses } = require('../models');

const TripController = {
  createTrip: async (req, res) => {
    try {
      const { destination, startDate, numberOfDays, invitedFriends, userId } = req.body;

      const trip = await CustomTrip.create({
        destination,
        startDate,
        numberOfDays,
        invitedFriends,
        userId
      });

      res.status(201).json({ status: true, trip });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // get trips by userId
  getTrips: async (req, res) => {
    try {
      const userId = req.params.userId;

      const trips = await CustomTrip.findByUserId(userId);

      res.status(200).json({ status: true, trips });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getTripsById: async (req, res) => {
    try {
      const id = req.params.id;

      const trips = await CustomTrip.findById(id);

      res.status(200).json({ status: true, trips });
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
