const express = require('express');
const auth = require('../config/auth');
const Customer = require('../models/Customer');
const router = express.Router();

//endpoint that gets hit to retrieve all of the user's posts
router.get('/retrieve/:userId',auth,(req,res) => {
    let id = req.params.userId;

    Customer.findById(id)
        .then(user => {
            let newArray = user.posts;
            let tempArray = [];
            newArray.forEach(post => {
                if(post !== null){
                    Customer.findById(post._id.toString)
                        .then(obj => {
                            console.log(obj);
                            tempArray.push(obj);
                        })
                        .catch(err => console.log(err));
                }
            })
        })
        .catch(err => console.log(err));
});

//endpoint that gets hit when the user adds a post
router.post('/add/:userId',auth,(req,res) => {
    let id = req.params.userId;
    let post = req.body.post;

    Customer.findByIdAndUpdate(id,{$push: {posts: posts}},{new: true})
        .then(user => {
            res.status(200).json({msg: 'success'});
        })
        .catch(err => console.log(err));
});

//endpoint that gets hit when the user deletes a post
router.post('/delete/:userId',auth,(req,res) => {
    let id = req.params.userId;
    let createdAt = req.body.createdAt;

    Customer.findByIdAndUpdate(id,{$pull: {posts: {postCreatedAt: createdAt}}},{new: true})
        .then(user => {
            res.status(200).json({msg: 'success'});
        })
        .catch(err = console.log(err));
});

//endpoint that gets hit when the user wants to delete every post
router.post('/deleteall/:userId',auth,(req,res) => {
    let id = req.params.id;

    Customer.findByIdAndUpdate(id,{posts: []},{new: true})
        .then(user => res.status(200).json({msg: 'success'}))
        .catch(err => console.log(err));
});

module.exports = router;