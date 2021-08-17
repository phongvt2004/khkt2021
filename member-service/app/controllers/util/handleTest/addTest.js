
const Test = require('../../../models/tests');
module.exports = {
    addTest: async function (testInfo) {
        var test = new Test(testInfo)
        return test.save()
}}