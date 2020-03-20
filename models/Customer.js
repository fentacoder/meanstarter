const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    posts: [
        {
            postId: Number,
            postTitle: String,
            postBody: String,
            postUpdatedAt: Date,
            postCreatedAt: Date
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Customer',Schema);