const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesUploads = new Schema(
    {
        groupId: {type: String, require: true},
        uploadURL: {type: String, require: true},
        type: {type: String, require: true},
        createAt: {type: Date, require: true}
    }
);

module.exports = mongoose.model('MessagesUploads', MessagesUploads);