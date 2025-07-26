const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {auth, isEmployee, isCustomer, isManager} = require('../middleware/auth')

const Person = require('./../model/person');


router.post('/signup', async (req,res) => {

    try {
        //fetch the data
        const data = req.body;
    
        //check if user exist or not
        const user = await Person.findOne({email : data.email});

        if(user) {
           return res.status(400).json({message: "User already exist."});
        }

       //create a new user
       let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(data.password,10);
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in hashing Password",
            });
        }
        
        //replace plain password with encrypted password;
        data.password = hashedPassword;
       
        //create entry of user;
       const NewUser = new Person(data);
    
       //save the new person in database
       const SavedNewPerson = await NewUser.save();

       console.log('New Person Data Saved')

        res.status(200).json({
          success: true,
          message: "User registered successfully."
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        })

    }

})


//login routes
router.post('/login', async (req, res) => {

    try {
        
        const {email, password} = req.body;

        if(!email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })

        }

        let isExistingUser = await Person.findOne({email});

        if(!isExistingUser) {
            return res.status(401).json({
                success: false,
                message: "User does not exist."
            })
        }

        const payload = {
            email: isExistingUser.email,
            id: isExistingUser._id,
            role: isExistingUser.role,
        };

        if(await bcrypt.compare(password, isExistingUser.password)) {
            
            //create token
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "5h"});
            
            isExistingUser = isExistingUser.toObject();
            isExistingUser.token = token;
            
            //remove the passworf from user object;
            isExistingUser.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("Cookies", token, options).status(200).json({
                success: true,
                token,
                isExistingUser,
                message: "User logged in successfully."
            })

        } else {

            return res.status(403).json({
                success: false,
                message: "Invalid password."
            })
        }

    } 
    catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to login.",
            error: error.message
        })
    }
})


//protected route for manager
router.get("/employeeDetail",auth,isManager, async (req,res) => {

    try {
        //fetch employee detail from database
        const employeeDetail = await Person.find({role : "Employee"})

        res.status(200).json({
            success: true,
            data: employeeDetail,
            message: "Employee details fetched successfully."
        })
    }
    catch (error) {
       
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch employee detail."
        })

    }
})


//protected route for manager
router.get("/customerDetails", async (req, res) => {
    
    try {
        
        const customerDetails = await Person.find({role: "Customer"});

        res.status(200).json({
            success: false,
            data: customerDetails,
            message: "Customer details fetched successfully."
        })
    }
    catch (error) {

        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch customer detail."
        })
    }
})


//balance withdraw route 
//this route is only for customer
router.post("/withdraw", async (req, res) => {

    try {
        
        //fetch amount from req body
        const {amount,email} = req.body;

        if(!email) {
            return res.status(401).json({
                success: false,
                message: "Please enter your email id."
            })
        }

        if(!amount || amount <= 0) {
            return res.status(402).json({
                success: false,
                message: "Invalid deposit balance."
            })
        }

        const user = await Person.findOne({email: email})
        
        if(!user) {
            return res.status(402).json({
                success: false,
                message: "User not found, please create account first."
            })
        }

        user.balance -= amount;
        
        //save the current balance
        await user.save();
        
        res.status(200).json({
            success: true,
            message: `₹${amount} withdrawn successfully.`,
            remainingBalance: user.balance
        });

        
    } 
    catch (error) {
        
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to withdraw balance."
        });

    }
})


//balance deposit route and this route is only for customer
router.post("/deposit", async (req, res) => {

    try {
        
        //fetch amount from req body
        const {amount, email} = req.body;

        if(!email) {
            return res.status(401).json({
                success: false,
                message: "Please enter your email id."
            })
        }

        if(!amount || amount <= 0) {
            return res.status(402).json({
                success: false,
                message: "Invalid deposit balance."
            })
        }

        const user = await Person.findOne({email: email})
        
        if(!user) {
            return res.status(402).json({
                success: false,
                message: "User not found, please create account first."
            })
        }

        //add the amount in user account
        user.balance += amount;
        await user.save();

        res.status(200).json({
            success: true,
            message: `₹${amount} deposited successfully.`,
            currentBalance: user.balance
        })

    }
    catch (error) {

        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to deposit balance."
        });

    }
})

//check balance route , this route is only for custmer

router.get('/checkBalance', async (req,res) => {

    try {

        const {email,password} = req.body;

        if(!email) {
            return res.status(401).json({
                success: false,
                message: "Please enter your email."
            })
        }

        const user = await Person.findOne({email:email});

        if(!user) {
            return res.status(402).json({
                success: false,
                message: "User not exist, please create account first."
            })
        }

        if(await bcrypt.compare(password, user.password)) {

            const balance = user.balance;

            return res.status(200).json({
                success: true,
                message: `Your current balance is ₹${balance}.`
            });

        } else {

            return res.status(401).json({
                success: false,
                message: "Invalid password."
            })
        }

        
    } catch {

        res.status(500).json({
            success: false,
            message: "Failed to fetch balance."
        });

    }
})




module.exports = router;