const {
  trip: tripModel,
  expense: expenseModel,
  budget: budgetModel,
  budget_category: budget_categoryModel,
  location: locationModel,
  activity: activityModel,
  trip_location: trip_locationModel,
  tour_essential: tour_essentialModel,
  trip_reminder: trip_reminderModel,
  react_trip: reactTripModel,
  public_trip: publicTripModel,
  User: userModel,
  trip_user: trip_userModel,
  share_trip: shareTripModel,
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
const crypto = require('crypto');

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
  console.log(req.params);
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

// $baseUrl/trip/current gives the currently active trip of a user
async function getCurrentTrips(req, res) {
  try {
    
    const trips = await tripModel.findOne({
      where: {
        user_id: req.user.userId,
        status: "active"
      }
    });
    //check if trip is null
    if (trips === null) {
      res.status(404).send({
        message: "No active trip found"
      });
    } else {
      res.status(200).send(trips);
    }
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
      destination,
      category
    } = req.body;

    const userId = req.user.userId;

    category = capitalizeFirst(category);

    const newTrip = await tripModel.create({
      starting_date: startDate,
      category: category,
      no_of_days: numberOfDays,
      starting_place: startPlace,
      destination: destination,
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

// $baseUrl/trip/react/:tripId react a specific trip
async function reactTrip(req, res){
  try {
    const tripId = req.params.tripId;
    const userId = req.user.userId;

    const trip = await tripModel.findByPk(tripId);
    if (trip === null) {
      res.status(404).send({
        message: "Trip not found"
      });
    } else {
      // check if user has already reacted
      const reaction = await reactTripModel.findOne({
        where: {
          trip_id: tripId,
          user_id: userId
        }
      });
      if (reaction !== null) {
        // remove reaction / unreact
        const unreact = await reactTripModel.destroy({
          where: {
            trip_id: tripId,
            user_id: userId
          }
        });
      } else {
        const newReaction = await reactTripModel.create({
          trip_id: tripId,
          user_id: userId
        });
    
        res.status(201).send({
          message: "Reaction added successfully",
          reaction: newReaction
        });
      }
    }

  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

// $baseUrl/trip/upload/:tripId upload photos to a trip

// $baseUrl/trip/invite/:tripId invite a user to a trip
async function inviteUser(req, res) {
  try {
      const tripId = req.params.tripId;
      const userId = req.user.userId;

      const trip = await tripModel.findByPk(tripId);
      if (trip === null) {
        res.status(404).send({
          message: "Trip not found"
        });
        return;
      } 

      // Generate a cryptographically secure random string for the shareable link
      function generateCryptographicallySecureRandomString() {
        return crypto.randomBytes(32).toString('hex');
      }

      const randomString = generateCryptographicallySecureRandomString();

      // Create the shareable link
      const shareableLink = `http://localhost:3000/trip/share/${randomString}`;

      const newInvite = await shareTripModel.create({
        trip_id: tripId,
        user_id: userId,
        link: shareableLink
      });

      res.status(201).send({
        message: "User invited successfully",
        invite: newInvite
      });

      } catch (err) {
        console.log(err);
        res.status(500).send({
          message: "Server error"
        });
      }
}

//***$baseurl/trip/public/***
// $baseUrl/trip/public/:tripId create public trip details
async function publicTripDetails(req, res) {
  const tripId = req.params.tripId;

  let {
    max_traveler_count,
    amount_per_head,
    important_notes,
    hotels,
    resturants,
    transport
  } = req.body;

  try {
    const trip = await tripModel.findByPk(tripId);

    if (!trip) {
      res.status(404).send({
        message: "Trip not found"
      });
    } else {
      const tripDetails = await publicTripModel.create({
        trip_id: tripId,
        max_traveler_count: max_traveler_count,
        remaining_slots: max_traveler_count,
        amount_per_head: amount_per_head,
        important_notes: important_notes,
        hotels: hotels,
        resturants: resturants,
        transport: transport
      });

      res.status(201).send({
        message: "Public trip details added successfully",
        tripDetails: tripDetails
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

// $baseUrl/trip/public/:tripId get public trip details
async function getPublicTripDetails(req, res) {

  try {
    const tripId = req.params.tripId;

    const trip = await tripModel.findByPk(tripId);
    if (!trip) {
      res.status(404).send({
        message: "Trip not found"
      });
    }

    const tripDetails = await publicTripModel.findOne({
      where: {
        trip_id: tripId
      },
      attributes: [
        'remaining_slots', 'amount_per_head', 'important_notes', 'hotels', 'resturants', 'transport'
      ]
    });

    const tripGuideDetails = await tripModel.findOne({
      where: {
        id: tripId
      },
      attributes: [
        'user_id'
      ],
      include: [{
        model: userModel,
        attributes: ['firstName', 'lastName', 'phoneNo']
      }]
    });

    const tripGuide = tripGuideDetails.User.firstName + " " + tripGuideDetails.User.lastName;
    const tripGuideContact = tripGuideDetails.User.phoneNo;
    
    res.status(200).send({
      tripDetails: tripDetails,
      tripGuide: tripGuide, 
      tripGuideContact: tripGuideContact
    });

  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

// $baseUrl/trip/public/:tripId PUT update public trip details
async function updatePublicTripDetails(req, res) {
  const tripId = req.params.tripId;

  let {
    remaining_slots,
    amount_per_head,
    important_notes,
    hotels,
    resturants,
    transport
  } = req.body;

  try {
    const trip = await tripModel.findByPk(tripId);

    if (!trip) {
      res.status(404).send({
        message: "Trip not found"
      });
    } else {
      const tripDetails = await publicTripModel.update({
        remaining_slots: remaining_slots,
        amount_per_head: amount_per_head,
        important_notes: important_notes,
        hotels: hotels,
        resturants: resturants,
        transport: transport
      }, {
        where: {
          trip_id: tripId
        }
      });

      res.status(201).send({
        message: "Public trip details updated successfully",
        tripDetails: tripDetails
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

// $baseUrl/trip/pulic/join/:tripId join public trip 
async function joinPublicTrip(req, res) {
  try {
    const tripId = req.params.tripId;
    const userId = req.user.userId;

    let {
      no_of_travelers,
      address
    } = req.body;

    // 1. check if remaining_slots > no_of_travelers
    const tripDetails = await publicTripModel.findOne({
      where: {
        trip_id: tripId
      },
      attributes: [
        'remaining_slots', 'amount_per_head'
      ]
    });

    if (tripDetails.remaining_slots < no_of_travelers) {
      res.status(400).send({
        message: "Slots not available"
      });
    } else {

      // 2. insert into trip_user table
      const newTripUser = await trip_userModel.create({
        user_id: userId,
        address: address,
        payment_status: false,
        no_of_travelers: no_of_travelers,
        trip_id: tripId
      });

      // 3. update remaining_slots 
      const remainingSlots = tripDetails.remaining_slots - no_of_travelers;
      await publicTripModel.update({
        remaining_slots: remainingSlots
      }, {
        where: {
          trip_id: tripId
        }
      });

      res.status(201).send({
        message: "Joined public trip successfully",
        newTripUser: newTripUser
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

// $baseUrl/trip/public/pay pay for public trip
// 1. check if payment_status is false
// 2. insert payment details into trip_payment table
// 3. update payment_status to true

// $baseUrl/trip/tripmates/:tripId get tripmates of a trip 
async function getTripMates(req, res) {
  try {
    const tripId = req.params.tripId;

    const trip = await tripModel.findByPk(tripId);
    if (!trip) {
      res.status(404).send({
        message: "Trip not found"
      });
    }

    const tripMates = await trip_userModel.findAll({
      where: {
        trip_id: tripId
      },
      attributes: [
        'user_id'
      ],
      include: [{
        model: userModel,
        attributes: ['firstName', 'lastName', 'username']
      }]
    });

    res.status(200).send(tripMates);

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
    let newExpenses = [];

    const newBudget = await budgetModel.create({
      budget_amount: budgetAmount,
      tripID: tripId,
    });

    for (const tripExpense of expenses) {
      let {
        category,
        expense_name,
        amount,
        date
      } = tripExpense;
      budgetAmount += amount;

      // category = capitalizeFirst(category);
      const categoryId = await getCategoryId(category);


      const newExpense = await expenseModel.create({
        category: categoryId,
        expense_name: expense_name,
        amount: amount,
        date: date,
        budget_id: newBudget.id,
        userID: userId
      });

      newExpenses.push(newExpense);
    }

    newExpenses = await newBudget.getExpenses({
      attributes: ['id', 'expense_name', 'amount', 'date'],
      include: [{
        model: budget_categoryModel,
        attributes: ['category_name'],
        required: true,
      }]
    });
    newExpenses = newExpenses.map(expense => {
      return {
        id: expense.id,
        expense_name: expense.expense_name,
        amount: expense.amount,
        category: expense.budget_category.category_name,
        date: expense.date
      };
    })

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

    if (budget === null) {
      res.status(404).send({
        message: "Budget not found"
      });
      return;
    }

    let expenses = await budget.getExpenses({
      attributes: ['id', 'expense_name', 'amount', 'date'],
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
        date: expense.date
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
        amount,
        date
      } = tripExpense;
      budgetAmount += amount;

      // category = capitalizeFirst(category);
      const categoryId = await getCategoryId(category);


      const newExpense = await expenseModel.create({
        expense_name: expense_name,
        amount: amount,
        category: categoryId,
        date: date,
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
async function createEssential(req, res) {
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

//get - getting essentials '/essential/:tripId'
async function getEssential (req, res) {
  const {
    tripId
  } = req.params;

  try {
    const essentials = await tour_essentialModel.findAll({
      where: {
        tripID: tripId,
      },
      order: [
        ['id', 'ASC'],
      ],
      attributes: ['id', 'essential_name', 'status'],
    });
    if (essentials.length === 0) {
      res.status(404).send({
        message: "Essential not found"
      })
    }
    res.status(200).send(essentials);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//get - getting an essential - search by essential name  /essential/:tripId/:essentialName
async function getEssentialByName(req, res) {
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
      attributes: ['essential_name', 'status']
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
async function updateEssential(req, res) {
  const {
    tripId,
    id
  } = req.params;
  let {
    status
  } = req.body;

  try {
    const updatedEssential = await tour_essentialModel.update({
      status: status
    }, {
      where: {
        tripID: tripId,
        id: id,
      }
    });
    if (updatedEssential[0] === 0) {
      res.status(404).send({
        message: "Essential not found"
      })
    } else {
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
async function deleteEssential(req, res) {
  const {
    tripId,
    id
  } = req.params;

  try {
    const deleteEssential = await tour_essentialModel.destroy({
      where: {
        tripID: tripId,
        id: id
      }
    })
    if (deleteEssential[0] === 0) {
      res.status(404).send({
        message: "Essential not found"
      })
    } else {
      res.status(200).send({
        message: "Essential deleted successfully"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}


//***$baseurl/trip/reminder/:tripId***
//post - inserting reminder '/reminder/:tripId'
async function createReminder(req, res) {
  const {
    tripId
  } = req.params;

  let {
    title,
    date,
    time
  } = req.body;

  const userId = req.user.userId;

  try {
    const newReminder = await trip_reminderModel.create({
      trip_id: tripId,
      title: title,
      date: date,
      time: time,
      user_id: userId
    })

    res.status(201).send({
      message: "Reminder addeded successfully",
      reminder: newReminder
    });

  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//get - getting reminders '/reminder/:tripId'
async function getReminder(req, res) {
  const {
    tripId
  } = req.params;

  try {
    const reminders = await trip_reminderModel.findAll({
      where: {
        trip_id: tripId,
      },
      order: [
        ['id', 'ASC'],
      ],
      attributes: ['title', 'date', 'time'],
    });
    if (reminders.length === 0) {
      res.status(404).send({
        message: "No reminders added"
      })
    }
    res.status(200).send(reminders);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    });
  }
}

//put - updating a reminder '/reminder/:tripId/:id'
async function updateReminder(req,res) {
  const {
    tripId,
    id
  } = req.params;

  let {
    title,
    date,
    time
  } = req.body;

  try {
    const updatedReminder = await trip_reminderModel.update({
      title: title,
      date: date,
      time: time,
    }, 
    {
      where: {
        trip_id: tripId,
        id: id,
      }
    });

    if (updatedReminder[0] === 0) {
      res.status(404).send({
        message: "Reminder not found"
      })
    } else {
      res.status(201).send({
        message: "Reminder updated successfully"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    })
  }
}

//delete '/reminder/:tripId/:id'
async function deleteReminder(req,res) {
  const {
    tripId,
    id
  } = req.params;

  try {
    const deleteReminder = await trip_reminderModel.destroy({
      where: {
        trip_id: tripId,
        id: id
      }
    })
    if (deleteReminder[0] === 0) {
      res.status(404).send({
        message: "Reminder not found"
      })
    } else {
      res.status(200).send({
        message: "Reminder deleted successfully"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server error"
    })
  }
}

module.exports = {
  getPublicTrips,
  getUserTrips,
  getTripFromId,
  updateTrip,
  createTrip,
  reactTrip,
  inviteUser,
  publicTripDetails,
  getPublicTripDetails,
  updatePublicTripDetails,
  joinPublicTrip,
  getTripMates,
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
  getEssentialByName,
  updateEssential,
  deleteEssential,
  createReminder,
  getReminder,
  updateReminder,
  deleteReminder,
  getCurrentTrips,
};