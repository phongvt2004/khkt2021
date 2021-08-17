const {getSystemTest, getGroupTest} = require("./util/handleTest/getTest")
const {addTest} = require("./util/handleTest/addTest")
const {updateTest} = require("./util/handleTest/updateTest")
const {deleteTest} = require("./util/handleTest/deleteTest")
const Test = require("../models/tests")

class TestController {
    getTestInfo(req, res, next) {

        Test.findOne({groupId: req.body.groupId, class: req.body.class, subject: req.body.subject})
            .then(testInfo => {
                res.json(testInfo)
            })
    }
    getTest(req, res, next) {
        if (req.body.isSystem) {
            delete req.body.isSystem;
            getSystemTest(req.body.number, req.body.class, req.body.subject)
                .then((test) => {
                    res.json({test, time: req.body.time})
                })
        } else {
            delete req.body.isSystem;
            Test.findOne({groupId: req.body.groupId, class: req.body.class, subject: req.body.subject})
                .then(testInfo => {
                    var test = getGroupTest(testInfo._id, testInfo.time)
                    return {test, time: testInfo.time}
                })
                .then(Test => {
                    res.json(Test)
                })
        }
    }

    addTest(req, res, next) {
        addTest(req.body)
            .then(() => {res.json({success: true})})
            .catch(next)
    }

    updateTest(req, res, next) {
        updateTest(req.body.testId, req.body.groupId, req.body)
            .then(res.json({success: true}))
            .catch(next)
    }

    deleteTest(req, res, next) {
        deleteTest(req.body.testId, req.body.groupId)
            .then(() => {res.json({success: true})})
            .catch(next)
    }
}

module.exports = new TestController;