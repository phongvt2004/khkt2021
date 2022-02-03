const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SystemQuestionCount = new Schema(
    {
        subject: {type: String, required: true},
        class: {type: Number, required: true},
        count: {type: Number, required: true},
    }
);

module.exports = mongoose.model('SystemQuestionCount', SystemQuestionCount);