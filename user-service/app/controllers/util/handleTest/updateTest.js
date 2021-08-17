
const Test = require('../../../models/tests');
module.exports = {
    updateTest: function (testId, groupId, newQuestion) {
        return Test.updateOne({_id: testId, groupId: groupId}, newQuestion)
}}