const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserRank = new Schema(
    {
        username: {type: String, required: true},
        userId: {type: String, required: true},
        point: {type: Number, required: true},
        time: {type:String, required: true},
    }
)

module.exports = mongoose.model('UserRank', UserRank);