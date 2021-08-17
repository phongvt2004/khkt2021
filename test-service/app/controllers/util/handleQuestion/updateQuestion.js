
const SystemQuestion = require('../../../models/systemQuestion');
const GroupQuestion = require('../../../models/groupQuestion');

module.exports = {
    updateSystemQues: function (questionId, newQuestion) {
        return SystemQuestion
            .updateOne({_id: questionId}, newQuestion)
    },
    updateGroupQues: function (questionId, testId, newQuestion) {
        return GroupQuestion
            .updateOne({_id: questionId, testId: testId}, newQuestion)
}}