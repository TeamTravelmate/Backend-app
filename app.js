const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { sequelize } = require('./models');
const { register, login } = require('./controller/authController');
const TripController = require('./controller/tripController');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = require('./models/');

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


//  Requests and Responses
app.get('/', (req, res) => {
  res.send('Welcome to the authentication app!');
})

app.post('/register', register);

app.post('/login', login);

app.post('/trip', TripController.createTrip);
app.post('/trip-add-expense', TripController.createExpense);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

