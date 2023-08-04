const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { sequelize } = require('./models');
const { register, login } = require('./controller/authController');


const app = express();
const port = 3000; // Set your desired port number

app.use(bodyParser.json());

const db = require('./models/index.js');

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
    
//     app.listen(port, () => {
//         console.log(`Server running on port ${port}`);
//     });
// });

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.get('/', (req, res) => {
  res.send('Welcome to the authentication app!');
});


  // Login endpoint
// Login endpoint
app.post('/login', login);
app.get('/login', login);
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });


