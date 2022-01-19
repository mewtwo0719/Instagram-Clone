const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const session = require('express-session')


//get a user by ID
router.get('/query/:userId', async(req, res) => {
    try{
     const user = await User.findById(req.params.userId);
     res.send(user)}catch(err){res.status(404).json(err)}
 }) 

 //get a user by username
router.get('/', async(req, res) => {
    
    try{
        const username = req.query.user;
        const user = await User.findOne({username:username});
        if(user) res.send(user)
        else res.send("No user found")
    }catch(err){res.status(500).json(err)}

})

//get multiple users that you are not following
router.get('/suggestions/:id', async(req, res) => {
    try{
        const currentUser = await User.findById(req.params.id);
        const users = await User.find({_id: {$nin : [...currentUser.following, currentUser._id]}});
        res.send(users)
 
    }catch(err){res.status(500).json(err); console.log(err)}
})

//get multiple users
router.post('/commenters', async(req, res) => {
    try{
        const commentersIds = req.body.commentersIds 
        const users = await User.find({_id: {$in : commentersIds}});
        res.send(users)
 
    }catch(err){res.status(500).json(err); console.log(err)}
})

//get multiple users
router.get('/allusers', async(req, res) => {
    try{
        const users = await User.find({_id: {$nin : [req.session.user._id]}});
        res.send(users)
 
    }catch(err){res.status(500).json(err); console.log(err)}
})

//follow a user
router.put('/:id/follow', async(req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers: req.body.userId}});
                await currentUser.updateOne({$push: {following: req.params.id}});
                res.status(200).json("User has been followed");
            } else{
                res.status(403).json("You already follow this user");
            }
        }catch(err){res.status(500).json(err); console.log(err)};
    }else{
        res.status(403).json("You cant follow yourself")
    }
});

//change profile photo
router.put('/changeavatar', async(req, res) => {
   
    try{
        const currentUser = req.session.user;
        const user = await User.findById(currentUser._id)
        const newName = "/" + req.body.fileName

       user.profilePicture = newName;
       user.save();
       req.session.user = user;
     

       res.status(200).json("The file has been uploaded")
        
    }catch(err){res.status(500).json(err); console.log(err)};
})
  
 
module.exports = router;