const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    User:userModel,
    Post:postModel,
    travel_guide: travelGuideModel
} = require('../models');

const validateUser = require('../middleware/validateUser');
const { password } = require('pg/lib/defaults');
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


// $baseUrl/user/myProfile gives all details of a user
router.get('/myProfile', validateUser, async (req, res) => {
    try {
      const profile = await userModel.findOne({
        where: {
            email: req.user.email
        }
      })
      res.status(200).send(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Server error"
      });
    }
});



//upgrade_to_travel_guide

router.post('/upgrade_to_tarvel_guide', validateUser, async (req, res) => {
    try {
      let {
        nic,
        nic_copy,
        SLTDA_License,
        Language,
        experience,
        experience_field,
        price_per_day,
        status
      } = req.body;
  
      const userId = req.user.userId;

      const newUpgrade = await travelGuideModel.create({
        nic: nic,
        nic_copy: nic_copy,
        SLTDA_License: SLTDA_License,
        language: Language,
        experience: experience,
        experience_field: experience_field,
        price_per_day: price_per_day,
        status: status,
        user_id: userId,
      });
      res.status(201).send({
        message: "Upgrade profile successfully",
        upgrde: newUpgrade
      });
      console.log(newUpgrade);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Server error"
      });
    }
  });



// $baseUrl/user/myPosts gives all details of a user
router.get('/myPosts', validateUser, async (req, res) => {
    try {
      const myPosts = await postModel.findAll({
        where: {
            userId: req.user.userId
        }
      })
      res.status(200).send(myPosts);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Server error"
      });
    }
});



//put - edit_profile
router.put('/edit_profile', validateUser, async (req, res) => {

    try {
      let {
        firstName,
        lastName,
        userName,
        phoneNo
      } = req.body;


      const user = await userModel.findOne({
        where: {
            email: req.user.email
        }
      });


      if (!user) {
        return res.status(404).send({
          message: 'User not found'
        });
      }

    user.firstName = firstName;
    user.lastName = lastName;
    user.username = userName;
    user.phoneNo = phoneNo;

    await user.save();

    res.status(200).send({
      message: 'Profile updated successfully',
      user: user // Optionally, send back the updated user object
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Server error'
    });
  }
});



//update_password
router.put("/update_password", validateUser, async(req,res)=>{
    try{
        let {
            newPassword
        }=req.body;
    

    const user = await userModel.findOne({
        where: {
            email: req.user.email
        }
    });

    if(!user){
        return res.status(404).send({
            message:'User not found'
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password= hashedPassword;

    await user.save();

    res.status(200).send({
        message: 'Password Update Successfully',
        user: user // Optionally, send back the updated user object
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: 'Server error'
      });
    }
  });    

module.exports = router;