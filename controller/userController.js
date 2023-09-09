const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User
} = require('../models');

router.post('/register', async (req, res, next) => {
    try {
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            birthday,
            gender,
            phoneNo
        } = req.body;
        const checkUser = await User.findOne({
            where: {
                email: email
            }
        })
        if (checkUser) {
            res.status(400).send({
                message: 'User already exists'
            })
        }
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
        //send a response to the client that the user was created with  the user object and token
        res.status(201).send({
            user: user,
            message: "User created successfully",
            sessionToken: jwt.sign({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
            }, process.env.SECRET, {
                expiresIn: 60 * 60 * 24
            })
        });
        console.log(user);
    } catch (error) {
        res.status(500).send({
            message: 'Something went wrong'
        });
        console.log(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;
        //email check
        const user = await User.findOne({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(401).send({
                error: 'Invalid email or password'
            });
        }
        //password check
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                error: 'Invalid email or password $user.password'
            });
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }, process.env.SECRET, {
            expiresIn: '1h'
        });

        res.status(200).send({
            message: 'Login successful',
            status: true,
            token: token
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
})


module.exports = router;