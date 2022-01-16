const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const session = require('express-session')

//REGISTER

router.post('/register', async (req, res) => {
    try{
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword
        });

        //save user and return respond
        const user = await newUser.save();
        req.session.user = user;
        res.status(200).json(user);
        
    } catch(err){res.status(500).json(err); console.log(err)}
})



//LOGIN


router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({username:req.body.username});
        !user && res.status(404).send("The username you entered doesn't belong to an account. Please check your username and try again.");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json('Sorry, your password was incorrect. Please double-check your password.');

        req.session.user = await user;
        res.status(200).json(user);
        
    } catch(err){res.status(500).json(err)}
})
        

//SESSION DATA

router.get('/session', (req, res) => {
    try{
        if (req.session.user ) res.status(200).json({user:req.session.user, logged: true})
        else res.status(202).json({logged: false})
    }catch(err){res.status(404).json(err)}
})

//LOG OUT
router.post('/logout', (req, res) => {
    try{
        req.session.user = null;
        res.send("Logout")
    }catch(err){res.status(500).json(err)}
})



module.exports = router;