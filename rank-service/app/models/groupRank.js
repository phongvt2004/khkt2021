const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupRank = new Schema(
    {
        groupName: {type: String, required: true},
        groupId: {type: String, required: true},
        point: {type: Number, required: true},
        time: {type:String, required: true},
        rank: {type: Number},
    }
)

module.exports = mongoose.model('GroupRank', GroupRank);