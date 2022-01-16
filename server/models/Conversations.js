const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 3,
            required: true
        },
        conversationImage: {
            type: String,
            default: "/group_avatar.png"
        },
        members: {
            type: Array,
        },
        status: {
            type: String,
            default: "Active now"
        },
        seen:{
            type: Array,
            default: []
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Conversation", ConversationSchema);