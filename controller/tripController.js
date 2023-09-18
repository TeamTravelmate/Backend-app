const {
  trip: tripModel,
  expense: expenseModel,
  budget: budgetModel,
  budget_category: budget_categoryModel,
  location: locationModel,
  activity: activityModel,
  trip_location: trip_locationModel,
  tour_essential: tour_essentialModel,
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
const {
  getLocationByName
} = require('../helpers/getLocationByName');
const {
  getActivityByName
} = require('../helpers/getActivityByName');

// $baseUrl/trip gives all public trips
async function getPublicTrips(req, res) {
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
async function getUserTrips(req, res) {
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
async function getTripFromId(req, res) {
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
async function updateTrip(req, res) {
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
async function createTrip(req, res) {
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
async function createBudget(req, res) {
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
async function getBudget(req, res) {
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
async function updateBudget(req, res) {

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

//***$baseurl/trip/location***

//post - inserting location
async function insertLocation(req, res) {
  try {
    let {
      name,
      city
    } = req.body;

    const userId = req.user.userId;

    const newLocation = await locationModel.create({
      name: name,
      city: city
    });
    res.status(201).send({
      message: "Location added successfully",
      location: newLocation
    });
    console.log(newLocation);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//get - getting a location '/location/:id'
async function getLocation(req, res) {
  const {
    id
  } = req.params;

  try {
    const location = await locationModel.findOne({
      where: {
        id: id,
      }
    })
    res.status(200).send(location);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//put - updating location '/location/:id'
async function updateLocation(req, res) {
  try {
    console.log(req.body);
    const updatedLocation = await locationModel.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (updatedLocation[0] === 0) {
      res.status(404).send({
        message: "Location not found"
      })
    } else {
      res.status(201).send({
        message: "Location updated successfully"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//delete - deleting location '/location/:id'
async function deleteLocation(req, res) {
  try {
    const deletedLocation = await locationModel.destroy({
      where: {
        id: req.params.id
      }
    });
    if (deletedLocation === 0) {
      res.status(404).send({
        message: "Location not found"
      })
    } else {
      res.status(201).send({
        message: "Location deleted successfully"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//***$baseurl/trip/activity***
//post - inserting an activity
async function insertActivity(req, res) {
  try {
    let {
      activity_name,
      description,
      location
    } = req.body;

    const userId = req.user.userId;

    const locationData = await getLocationByName(location);
    const locationId = locationData.id;

    const newActivity = await activityModel.create({
      activity_name: activity_name,
      description: description,
      lodation_id: locationId
    });
    res.status(201).send({
      message: "Activity added successfully",
      activity: newActivity
    });
    console.log(newActivity);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//get - getting activity '/activity/:id'
async function getActivity(req, res) {
  const {
    id
  } = req.params;
  try {
    const activity = await activityModel.findOne({
      where: {
        id: id,
      }
    })
    res.status(200).send(activity);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}


//put - updating an activity '/activity/:id'
async function updateActivity(req, res) {
  try {
    const updatedActivity = await activityModel.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (updatedActivity[0] === 0) {
      res.status(404).send({
        message: "Activity not found"
      })
    } else {
      res.status(201).send({
        message: "Activity updated successfully"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}


//***$baseurl/trip/itinerary/:tripId***

//post - inserting/creating a itinerary
async function createItinerary(req, res) {
  try {
    const {
      tripId
    } = req.params;
    let {
      day,
      location,
      activity
    } = req.body;

    const locationData = await getLocationByName(location);
    const locationId = locationData.id;

    const activityData = await getActivityByName(activity);
    const activityId = activityData.id;

    const newItinerary = await trip_locationModel.create({
      tripID: tripId,
      day: day,
      locationID: locationId,
      activity_id: activityId,
    });
    res.status(201).send({
      message: "Itinerary created successfully",
      itinerary: newItinerary
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//get - getting an itinerary
async function getItinerary(req, res) {
  const {
    tripId
  } = req.params;

  try {
    const newItinerary = await trip_locationModel.findAll({
      where: {
        tripID: tripId,
      },
      order: [
        ['id', 'ASC'],
      ],
      attributes: [
        'id', 'tripID', 'day'
      ],
      include: [
        // {
        //   model: locationModel,
        //   on: sequelize.literal('location.id = trip_location.locationID'),
        //   attributes: ['name'],
        //   required: true,
        // },
        {
          model: activityModel,
          on: sequelize.literal('activity.id = trip_location.activity_id'),
          attributes: ['activity_name'],
          required: true,
        }
      ]
    })

    res.status(200).send({
      newItinerary: newItinerary
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//put - updating an itinerary '/itinerary/:tripId/:id'
async function updateItinerary(req, res) {
  try {
    const {
      tripId,
      id
    } = req.params;
    let {
      day,
      location,
      activity
    } = req.body;

    const locationData = await getLocationByName(location);
    const locationId = locationData.id;

    const activityData = await getActivityByName(activity);
    const activityId = activityData.id;

    const updatedItinerary = await trip_locationModel.update({
      tripID: tripId,
      day: day,
      locationID: locationId,
      activity_id: activityId,
    }, {
      where: {
        id: id,
      }
    });
    if (updatedItinerary[0] === 0) {
      res.status(404).send({
        message: "Itinerary not found"
      })
    } else {
      res.status(201).send({
        message: "Itinerary updated successfully",
        itinerary: tripId,
        day,
        locationId,
        activityId
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//delete - deleting an itinerary '/itinerary/:tripId/:id'
async function deleteItinerary(req, res) {
  const {
    tripId,
    id
  } = req.params;

  try {
    const deleteItinerary = await trip_locationModel.destroy({
      where: {
        tripID: tripId,
        id: id
      }
    })
    if (deleteItineraryItinerary[0] === 0) {
      res.status(404).send({
        message: "Itinerary not found"
      })
    } else {
      res.status(200).send({
        message: "Itinerary deleted successfully",
        deleteItinerary: id
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//***$baseurl/trip/essential/:tripId***
//post - inserting essential '/essential/:tripId'
async function createEssential (req, res) {
  try {
    const {
      tripId
    } = req.params;
    let {
      essential_name,
      status
    } = req.body;

    const userId = req.user.userId;

    const newEssential = await tour_essentialModel.create({
      tripID: tripId,
      essential_name: essential_name,
      status: status,
      userID: userId
    });

    res.status(201).send({
      message: "Essential addeded successfully",
      essential: newEssential
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}
//get - getting an essential - search by essential name  /essential/:tripId/:essentialName
async function getEssential (req, res) {
  const {
    tripId,
    essentialName
  } = req.params;
  
  try {
    const essential = await tour_essentialModel.findOne({
      where: {
        tripID: tripId,
        essential_name: essentialName
      },
      attributes: 
      ['essential_name', 'status']
    });
    if (essential == null) {
      res.status(404).send({
        message: "Essential not found"
      })
    }
    res.status(200).send(essential);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
  }
  
  //put - updating an essential '/essential/:tripId/:id'
  async function updatedEssential (req,res){
    const {
      tripId,
      id 
    } = req.params;
    let {
      status
    } = req.body;
  
    try {
      const updatedEssential = await tour_essentialModel.update(
      {
        status: status
      }, {
        where: {
          tripID: tripId,
          id: id,
        }
      });
      if(updatedEssential[0] === 0){
        res.status(404).send({
          message: "Essential not found"
        })
      }else{
        res.status(201).send({
          message: "Essential updated successfully"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Server error"
      });
    }
  }
  //delete '/essential/:tripId/:id'
  async function deleteEssential (req, res){
    const {
      tripId,
      id
    } = req.params;
  
    try {
      const deleteEssential = await tour_essentialModel.destroy ({
        where: {
          tripID : tripId,
          id: id
        }
      })
      if(deleteEssential[0] === 0){
        res.status(404).send({
          message: "Essential not found"
        })
      }else{
      res.status(200).send({
        message: "Essential deleted successfully"
      });
    }
    } catch (err){
      console.log(err);
      res.status(500).send({
        message: "Server error"
      });
    }
  }

module.exports = {
  getPublicTrips,
  getUserTrips,
  getTripFromId,
  updateTrip,
  createTrip,
  createBudget,
  getBudget,
  updateBudget,
  insertLocation,
  getLocation,
  updateLocation,
  deleteLocation,
  insertActivity,
  getActivity,
  updateActivity,
  createItinerary,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  createEssential,
  getEssential,
  updatedEssential,
  deleteEssential
};