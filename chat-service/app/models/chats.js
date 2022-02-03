const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chats = new Schema(
    {
        groupId: {type: String, required: true},
        sender: {type: String, required: true},
        message: {type: String, required: true},
        type: {type: String, required: true},
        time: {type: String, required: true}
    }, 
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Chats', Chats)
