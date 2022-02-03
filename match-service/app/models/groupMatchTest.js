const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupMatchTest = new Schema(
    {
        questionList: {type: Array},
        time: {type: Number},
        subject: {type: String},
        class: {type: Number}
    }
)

module.exports = mongoose.model('GroupMatchTest', GroupMatchTest);