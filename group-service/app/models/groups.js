const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Groups = new Schema(
    {
        name: {type: String, required: true},
        avatar: {type: String},
        leaderId: {type: String, required: true},
        class: {type: Number, required: true},
        memberIds: {type: Array},
        hasSubjects: {type: Array, required: true},
        requiredSubjects: {type: Array, required: true},
        testNumber: {type: Number, required: true},
        joinRequest: {type: Array},
        rank: {type: Number},
        groupPoint: {type: Number},
        /**
         *{
            username: String,
            result: point,
            createAt:
         }
         * */
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Groups', Groups);