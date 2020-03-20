const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const router = express.Router();

router.post('/register',(req,res)=> {
    const {name,email,password} = req.body;
    let errors = [];

    if(!name || !email || !password){
        errors.push('please enter all fields');
    }

    if(name.length > 60){
        errors.push('name is too large it must be less than 60 characters');
    }

    if(name.length < 3){
        errors.push('name is too small it must be greater than 3 characters');
    }

    if(email.length > 60){
        errors.push('email is too large it must be less than 60 characters');
    }

    if(email.length < 3){
        errors.push('email is too small it must be greater than 3 characters');
    }

    if(email.length > 60){
        errors.push('password is too large it must be less than 60 characters');
    }

    if(email.length < 3){
        errors.push('password is too small it must be greater than 3 characters');
    }

    if(!email.includes('@')){
        errors.push('invalid email');
    }

    //check to see if the email already exists
    Customer.findOne({email})
        .then(user => {
            if(user) errors.push('email already exists');

            if(errors.size > 0){
                return res.status(400).json({msg: errors});
            }
            
            bcryptjs.genSalt(10, (err, salt) => {
                if(err) throw err;
                bcryptjs.hash(password,salt,(err,hash) => {
                    if(err) throw err;

                    //create a new user
                    const newUser = new Customer({
                        name,
                        email,
                        password
                    });

                    //set new password to the hash
                    newUser.password = hash;

                    //save to the database
                    newUser.save()
                        .then(user => {
                            //create a new token
                            jwt.sign(
                                {id: user._id},
                                process.env.JWT_SECRET,
                                {expiresIn: 3600},
                                (err,token) => {
                                    if(err) throw err;
                                    const newObj = {
                                        token,
                                        _id : user._id
                                    };
                                    res.status(200).json(newObj);
                                }
                            );
                        })
                        .catch(err => console.log(err));
                });
            });
        })
        .catch(err => console.log(err));
});

router.post('/login',(req,res) => {
    const {email,password} = req.body;
    let errors = [];

    if(!email || !password){
        errors.push('please enter all fields');
    }

    if(email.length > 60){
        errors.push('email is too large it must be less than 60 characters');
    }

    if(email.length < 3){
        errors.push('email is too small it must be greater than 3 characters');
    }

    if(email.length > 60){
        errors.push('password is too large it must be less than 60 characters');
    }

    if(email.length < 3){
        errors.push('password is too small it must be greater than 3 characters');
    }

    if(!email.includes('@')){
        errors.push('invalid email');
    }

    if(errors.size > 0){
        return res.status(400).json({msg: errors});
    }

    //check to see if the email already exists
    Customer.findOne({email})
        .then(user => {

            bcryptjs.compare(password,user.password,(err,success) => {
                if(err) throw err;

                if(!success) return res.status(400).json({msg: 'password is not valid for this email'});

                //create a new token
                jwt.sign(
                    {id: user._id},
                    process.env.JWT_SECRET,
                    {expiresIn: 3600},
                    (err,token) => {
                        if(err) throw err;
                        const newObj = {
                            token,
                            _id : user._id,
                            posts: user.posts
                        };
                        res.status(200).json(newObj);
                    }
                );
            });

        })
        .catch(err => console.log(err));
});

router.get('/aunthenticate',auth,(req,res) => {
    Customer.findById(req.user.id)
    .select('-password')
    .then(user => res.status(200).json(user))
    .catch(err => console.log(err));
});

module.exports = router;