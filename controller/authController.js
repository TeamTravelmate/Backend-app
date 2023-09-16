const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const {User} = require('../models');

const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, birthday, gender, phoneNo} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      birthday,
      gender,
      username,      
      email,
      phoneNo,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password $user.password' });
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign({ userId: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', status: true, user: user, token: token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login };
