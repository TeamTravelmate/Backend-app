const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { sequelize } = require('./models');
const app = express();
const port = 3000;

const tripRoutes = require('./routes/tripRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(bodyParser.json());
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

app.use('/user', userRoutes);
app.use('/trip', tripRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

