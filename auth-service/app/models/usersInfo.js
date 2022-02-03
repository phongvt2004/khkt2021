const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

const UsersInfo = new Schema(
    {
        fullname: {type: String, required: true},
        username: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        gender: {type: String, required: true},
        class: {type: Number, required: true},
        goodAt: {type: Array, required: true},
        badAt: {type: Array, required: true},
        slug: { type: String, slug: 'fullname', unique: true }
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);
module.exports = mongoose.model('UsersInfo', UsersInfo);