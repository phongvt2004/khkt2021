const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LastReadChats = new Schema(
    {
        chatId: {type: String, required: true},
        username: {type: String, required: true},
    }
)

module.exports = mongoose.model('LastReadChats', LastReadChats)
