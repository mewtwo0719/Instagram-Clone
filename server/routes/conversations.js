const router = require('express').Router();
const Conversation = require('../models/Conversations');

//new conv

router.post('/', async (req, res) => {
    const newConversation = new Conversation({
        members: req.body.members,
        name: req.body.name,
        conversationImage: req.body.conversationImage
    });

    try{
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);

    }catch(err){res.status(500).json(err); console.log(err)}
})

//get all conversations

router.get('/:userId', async(req, res) => {
    try{
        const conversation = await Conversation.find({
            members: {$in: [req.params.userId]}
        });
        res.status(200).json(conversation);
    } catch(err){res.status(500).json(err); console.log(err)}
});



module.exports = router;