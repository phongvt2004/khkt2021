const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestRank = new Schema(
    {
        point: {type: Number},
        time: {type:String},
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('TestRank', TestRank);