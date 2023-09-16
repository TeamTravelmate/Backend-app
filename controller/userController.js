const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User:userModel
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
        const checkUser = await userModel.findOne({
            where: {
                email: email
            }
        })
        if (checkUser) {
            res.status(400).send({
                message: 'User already exists'
            })
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
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
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }, process.env.SECRET, {
                expiresIn: 60*60*24*30
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
        const {email,password} = req.body;
        //email check
        const user = await userModel.findOne({
            where: {
                email
            }
        });
        if (user == null) {
            return res.status(401).send({
                error: 'Invalid email or password'
            });
        }
        //password check
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                error: `Invalid email or password`
            });
        }

        const token = jwt.sign({
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }, process.env.SECRET, {
            expiresIn: 60*60*24*30
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