const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { sequelize } = require('./models');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const tripRoutes = require('./routes/tripRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const followerRoutes = require('./routes/followerRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use("/Images/pro_pic", express.static('Images/pro_pic'));
app.use("/Images/post", express.static('Images/post'));

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
app.use('/search', searchRoutes);
app.use('/vendor', vendorRoutes);
app.use('/follower', followerRoutes);
app.use('/admin', adminRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

