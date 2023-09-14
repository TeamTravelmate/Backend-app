const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { sequelize } = require('./models');


const { register, login } = require('./controller/authController');
const TripController = require('./controller/tripController');
const UserController = require('./controller/userController');

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
  res.send('Welcome to TRAVELMATE!');
})

app.use('/user', UserController);
app.use('/trip', TripController);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

