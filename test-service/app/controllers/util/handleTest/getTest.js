
const Test = require('../../../models/tests');
module.exports = {
    getSystemTest: function (number, grade, subject) {
        
        var test = []
        return Test.find({subject: subject, class: grade}).sort(()=>{return 0.5 - Math.random()})
            .then((questions) => {
                var quesList = [...questions]
                for(let i = 0; i < number; i++) {
                    test.push(quesList[i])
                }
                return test
            })
    },
    getGroupTest: function (testId, time) {
        
        var test = []
        return Test.find({testId: testId})
            .then((questions) => {
                test = [...questions]
                return {test: test, time: time};
            })
}}