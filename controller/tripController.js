const router = require('express').Router();
const {
  trip: tripModel,
  expense: expenseModel,
  budget: budgetModel,
  budget_category: budget_categoryModel,
  sequelize
} = require('../models');
const validateUser = require('../middleware/validateUser');
const {
  getCategoryId
} = require('../helpers/categoryCheck');
const {
  capitalizeFirst
} = require('../helpers/capitalizeFirstLetter');

expenseModel.belongsTo(budget_categoryModel, {
  foreignKey: 'category'
});

// $baseUrl/trip gives all public trips
router.get('/', async (req, res) => {
  try {
    const trips = await tripModel.findAll({
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
    const trips = await tripModel.findAll({
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
    const trips = await tripModel.findByPk(req.params.id);
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
    const trips = await tripModel.update(req.body, {
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

    category = capitalizeFirst(category);

    const newTrip = await tripModel.create({
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

//***$baseurl/trip/budget/:tripId***

//post - inserting/creating a budget
router.post('/budget/:tripId', validateUser, async (req, res) => {
  try {
    const {
      tripId
    } = req.params;
    const {
      expenses
    } = req.body;
    const userId = req.user.userId;
    let budgetAmount = 0;
    const newExpenses = [];

    const newBudget = await budgetModel.create({
      budget_amount: budgetAmount,
      tripID: tripId,
    });

    for (const tripExpense of expenses) {
      let {
        category,
        expense_name,
        amount
      } = tripExpense;
      budgetAmount += amount;

      category = capitalizeFirst(category);
      const categoryId = await getCategoryId(category);


      const newExpense = await expenseModel.create({
        category: categoryId,
        expense_name: expense_name,
        amount: amount,
        budget_id: newBudget.id,
        userID: userId
      });

      newExpenses.push(newExpense);
    }

    newBudget.amount = budgetAmount;
    await newBudget.save();


    res.status(201).send({
      message: "Budget created successfully",
      budget: newBudget,
      expenses: newExpenses
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
});

//get - getting a budget
router.get('/budget/:tripId', async (req, res) => {
  const {
    tripId
  } = req.params;

  try {
    const newBudget = await budgetModel.findOne({
      where: {
        tripID: tripId,
      },
      attributes: ['id', 'amount'],
    })
    let expenses = await expenseModel.findAll({
      where: {
        budget_id: newBudget.id,
      },
      attributes: ['id', 'expense_name', 'amount'],
      include: [{
        model: budget_categoryModel,
        on: sequelize.literal('budget_category.id::text = expense.category'),
        attributes: ['category_name'],
        required: true,
      }]
    })
    expenses = expenses.map(expense => {
      return {
        id: expense.id,
        expense_name: expense.expense_name,
        amount: expense.amount,
        category: expense.budget_category.category_name,
      };
    })
    res.status(200).send({
      budget: newBudget,
      expenses: expenses
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
})

//put - updating a budget
router.put('/budget/:tripId', validateUser, async (req, res) => {
  const tripId = req.params.tripId;
  const userId = req.user.userId;

  try {
    let {
      budget,
      expenses
    } = req.body;

    const newExpenses = [];
    let budgetAmount = 0;

    //drop all previous expenses
    await expenseModel.destroy({
      where: {
        budget_id: budget.id,
      }
    });

    for (const tripExpense of expenses) {
      let {
        id,
        category,
        expense_name,
        amount
      } = tripExpense;
      budgetAmount += amount;

      category = capitalizeFirst(category);
      const categoryId = await getCategoryId(category);


      const newExpense = await expenseModel.create({
        expense_name: expense_name,
        amount: amount,
        category: categoryId,
        budget_id: budget.id,
        userID: userId
      }, );

      newExpenses.push(newExpense);
    }

    await budgetModel.update({
      amount: budgetAmount,
    }, {
      where: {
        id: budget.id,
      }
    });


    res.status(201).send({
      message: "Updated successfully",
      budget: {
        id: budget.id,
        budget_amount: budgetAmount,
      },
      expenses: newExpenses
    })
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  };
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