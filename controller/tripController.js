const {
  trip: tripModel,
  expense: expenseModel,
  budget: budgetModel,
  budget_category: budget_categoryModel,
  sequelize
} = require('../models');
const {
  getTripBudgetId
} = require('../helpers/getBudgetId');
const {
  getCategoryId
} = require('../helpers/categoryCheck');
const {
  
  capitalizeFirst
} = require('../helpers/capitalizeFirstLetter');

// $baseUrl/trip gives all public trips
async function getPublicTrips (req, res){
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
}

// $baseUrl/trip/myTrips gives all trips of a user
async function getUserTrips (req, res){
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
}

// $baseUrl/trip/tripId gives a specific trip
async function getTripFromId (req, res){
  // console.log(req.params);
  try {
    const trips = await tripModel.findByPk(req.params.tripId);
    res.status(200).send(trips);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

// $baseUrl/trip/ PUT updates a specific trip
async function updateTrip (req, res){
  const tripId = req.body.id;
  try {
    const trips = await tripModel.update(req.body, {
      where: {
        id: tripId,
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
}

// $baseUrl/trip POST creates a new trip by the user
async function createTrip (req, res){
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
    // console.log(newTrip);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//***$baseurl/trip/budget/***
//post - inserting/creating a budget
async function createBudget (req, res){
  try {
    const {
      tripId,
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
}

//get - getting a budget
async function getBudget (req, res){
  const {
    tripId
  } = req.params;
  console.log(req.params);
  try {
    const trip = await tripModel.findByPk(tripId);
    const budget = await trip.getBudget({
      attributes: ['id', 'amount'],
    });

    let expenses = await budget.getExpenses({
      attributes: ['id', 'expense_name', 'amount'],
      include: [{
        model: budget_categoryModel,
        attributes: ['category_name'],
        required: true,
      }]
    });
    expenses = expenses.map(expense => {
      return {
        id: expense.id,
        expense_name: expense.expense_name,
        amount: expense.amount,
        category: expense.budget_category.category_name,
      };
    })
    res.status(200).send({
      budget: budget,
      expenses: expenses
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//put - updating a budget
async function updateBudget(req, res){

  try {
    let {
      trip,
      budget,
      expenses
    } = req.body;

    const newExpenses = [];
    let budgetAmount = 0;
    if (trip) {
      budget.id = await getTripBudgetId(trip.id);
    }
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
        userID: req.user.userId
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
      // budget: {
      //   id: budget.id,
      //   budget_amount: budgetAmount,
      // },
      // expenses: newExpenses
    })
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  };
}

module.exports = {
  getPublicTrips,
  getUserTrips,
  getTripFromId,
  updateTrip,
  createTrip,
  createBudget,
  getBudget,
  updateBudget
};