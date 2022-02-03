const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SystemQuestion = new Schema(
    {
        subject: {type: String, required: true},
        class: {type: Number, required: true},
        index: {type: Number, required: true},
        question: {type: String, required: true},
        image: {type: Array},
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

module.exports = mongoose.model('SystemQuestion', SystemQuestion);