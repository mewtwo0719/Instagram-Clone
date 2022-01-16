const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        min: 3,
        max: 30,
        default: ""
    },
    username:{
        type: String,
        required: true,
        min:3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password:{
        type: String,
        require: true,
        min: 8
    },
    profilePicture:{
        type: String,
        default: "/default_avatar.jpg"
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    saved:{
        type: Array,
        default: []
    },
    bio:{
        type: String,
        max: 500,
        default: ""
    }
},
{timestamps: true});

module.exports = mongoose.model("User", UserSchema);