const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserMatchTest = new Schema(
    {
        questionList: {type: Array},
        time: {type: Number},
        class: {type: Number}
    }
)

module.exports = mongoose.model('UserMatchTest', UserMatchTest);