const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Test = new Schema(
    {
        subject: {type: String, required: true},
        class: {type: Number, required: true},
        groupId: {type: String, required: true},
        number: {type: Number, required: true},
        time: {type: Number, required: true}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Test', Test);