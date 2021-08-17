const Test = require('../../../models/tests');
module.exports = {
    deleteTest: function (testId, groupId) {
        return Test.deleteOne({_id: testId, groupId: groupId})
}}