const GroupQuestion = require('../../../models/groupQuestion');
const SystemQuestion = require('../../../models/systemQuestion');
module.exports = {
    deleteSystemQues: function (questionId) {
        return SystemQuestion
            .deleteOne({_id: questionId})
    },
    deleteGroupQues: function (questionId, testId) {
        return GroupQuestion
            .deleteOne({_id: questionId, testId: testId})
}}