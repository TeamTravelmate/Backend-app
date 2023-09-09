const router = require('express').Router();
const {
  trip
} = require('../models');
const validateUser = require('../middleware/validateUser');


// $baseUrl/trip gives all public trips
router.get('/', async (req, res) => {
  try {
    const trips = await trip.findAll({
      where: {
        category: "Public"
      }
    })
    res.status(200).send(trips);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
});

// $baseUrl/trip/myTrips gives all trips of a user
router.get('/myTrips', validateUser, async (req, res) => {
  try {
    const trips = await trip.findAll({
      where: {
        user_id: req.user.userId
      }
    })
    res.status(200).send(trips);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
});

// $baseUrl/trip/tripId gives a specific trip
router.get('/:id', async (req, res) => {
  console.log(req.params);
  try {
    const trips = await trip.findByPk(req.params.id);
    res.status(200).send(trips);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
});

// $baseUrl/trip/tripId PUT updates a specific trip
router.put('/:id', validateUser, async (req, res) => {
  console.log(req.body);
  console.log(req.user.userId);
  try {
    const trips = await trip.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.user.userId
      }
    });
    if (trips[0] === 0) {
      res.status(404).send({
        message: "Trip not found"
      })
    } else {
      res.status(200).send({
        message: "Trip updated successfully"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
});

// $baseUrl/trip POST creates a new trip by the user
router.post('/', validateUser, async (req, res) => {
  try {
    let {
      startDate,
      numberOfDays,
      startPlace,
      category
    } = req.body;

    const userId = req.user.userId;
    category = category.toLowerCase();
    category = category.charAt(0).toUpperCase() + category.slice(1);

    const newTrip = await trip.create({
      starting_date: startDate,
      category: category,
      no_of_days: numberOfDays,
      starting_place: startPlace,
      user_id: userId,
    });
    res.status(201).send({
      message: "Trip created successfully",
      trip: newTrip
    });
    console.log(newTrip);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
});



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