const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupQuestion = new Schema(
    {
        subject: {type: String, required: true},
        class: {type: Number, required: true},
        testId: {type: String, required: true},
        groupId: {type: String, required: true},
        question: {type: String, required: true},
        image: {type: String},
        A: {type: String, required: true},
        B: {type: String, required: true},
        C: {type: String, required: true},
        D: {type: String, required: true},
        correct: {type: String, required: true}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('GroupQuestion', GroupQuestion);