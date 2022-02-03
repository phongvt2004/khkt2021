const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema(
    {
        userId: {type: String, required: true},
        username: {type: String},
        groupName: {type: String},
        groupId: {type: String},
        testId: {type: String},
        type:{type: String, required: true},
        isRead: {type: Boolean, require: true},
        createAt: {type: String, required: true}
    }
)

module.exports = mongoose.model('Notification', Notification)