const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserStatus = new Schema(
    {
        userId: {type: String, required: true},
        inGroups: {type: Array},
        waitGroups: {type: Array},
        isConfirmMail: {type: Boolean, required: true},
        isAmin: {type: Boolean, required: true},
        historySubject: {type: Array, required: true},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('UserStatus', UserStatus);