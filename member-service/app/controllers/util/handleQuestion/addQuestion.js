

const SystemQuestion = require('../../../models/systemQuestion');
const GroupQuestion = require('../../../models/groupQuestion');
module.exports = {
    addSystemQues: function (questionInfo) {
        var question = new SystemQuestion(questionInfo)
        return question
            .save()

    },
    addGroupQues: function (questionInfo) {
        var question = new GroupQuestion(questionInfo)
        return question
            .save()
}}