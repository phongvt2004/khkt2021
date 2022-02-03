const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LineUp = new Schema(
    {
        groupId: {type: String, required: true},
        class: {type: Number, required: true},
        team: {type:Array},
        /**
         * {
         *  username,
         *  userId,
         *  subject,
         *  done
         * }
         */
    }
)

module.exports = mongoose.model('LineUp', LineUp);