const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewChats = new Schema(
    {
        chatId: {type: String, required: true},
        groupId: {type: String, required: true},
        readed: {type: Array, required: true},
    }
)

module.exports = mongoose.model('NewChats', NewChats)