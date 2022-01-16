const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    
        conversationId: {
            type: String,
            required: true
        },
        sender: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        seen: {
            type: Array
        } 
},

{timestamps: true}
);

module.exports = mongoose.model("Message", MessageSchema)