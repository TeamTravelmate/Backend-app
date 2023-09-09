const router = require('express').Router();
const {
  trip
} = require('../models');
const validateUser = require('../middleware/validateUser');

router.get('/', validateUser, async (req, res) => {
  try {
    const trips = await trip.findAll();
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).send({
      message: "Server error"
    });
  }
});

router.post('/', validateUser, async (req, res) => {
      try {
        let {
          startDate,
          numberOfDays,
          startPlace,
          category
        } = req.body;

        const userId = req.user.id;
        const newTrip = await trip.create({
          starting_date: startDate,
          category: category,
          no_of_days: numberOfDays,
          starting_place: startPlace,
          user_id: userId,
        });
        console.log(newTrip);
      } catch (err) {
        res.status(500).send({
          message: "Server error"
        });
      }
    });

    // const TripController = {
    //   createTrip: async (req, res) => {
    //     try {
    //       const { destination, startDate, numberOfDays, invitedFriends, userId } = req.body;

    //       const trip = await CustomTrip.create({
    //         destination,
    //         startDate,
    //         numberOfDays,
    //         invitedFriends,
    //         userId
    //       });

    //       res.status(201).json({ status: true, trip });
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).json({ message: 'Internal server error' });
    //     }
    //   },

    //   // get trips by userId
    //   getTrips: async (req, res) => {
    //     try {
    //       const userId = req.params.userId;

    //       const trips = await CustomTrip.findByUserId(userId);

    //       res.status(200).json({ status: true, trips });
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).json({ message: 'Internal server error' });
    //     }
    //   },

    //   getTripsById: async (req, res) => {
    //     try {
    //       const id = req.params.id;

    //       const trips = await CustomTrip.findById(id);

    //       res.status(200).json({ status: true, trips });
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).json({ message: 'Internal server error' });
    //     }
    //   },

    //   createExpense: async (req, res) => {
    //     try {
    //       const { category, expense_name, amount, tripId } = req.body;

    //       const exp = await expenses.create({
    //         category,
    //         expense_name,
    //         amount,
    //         tripId
    //       });

    //       res.status(201).json(exp);
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).json({ message: 'Internal server error' });
    //     }
    //   }
    // };

    module.exports = router;