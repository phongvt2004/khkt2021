const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

const Groups = new Schema(
    {
        name: {type: String, required: true},
        leader: {type: String, required: true},
        class: {type: Number, required: true},
        memberIds: {type: Array, required: true},
        memberNumber: {type: Number, required: true},
        hasSubjects: {type: Array, required: true},
        requiredSubjects: {type: Array},
        testIds: {type: Array},
        userRequired: {type: Array},
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        timestamps: true,
    }
)


mongoose.plugin(slug);
module.exports = mongoose.model('Groups', Groups);