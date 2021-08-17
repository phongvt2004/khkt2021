
const SystemQuestion = require('../../../models/systemQuestion');
const GroupQuestion = require('../../../models/groupQuestion');

module.exports = {
    getSystemQues: function (number, grade, subject, id) {
        if (number === 'all') {
            return SystemQuestion
                .find({class: grade, subject: subject})
        } else {
            return SystemQuestion
                .findOne({_id: id})
        }
    },
    getGroupQues: function (number, grade, subject, id) {
        if (number === 'all') {
            return GroupQuestion
                .find({class: grade, subject: subject, groupId: id})
        } else {
            return GroupQuestion
                .findOne({_id: id})
        }
}}