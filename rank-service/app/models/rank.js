const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Rank = new Schema(
    {
        index: {type:String},
        value: {type:Array}
    }
)

module.exports = mongoose.model('Rank', Rank);