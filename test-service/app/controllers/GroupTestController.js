const Tests = require("../models/tests")
const axios = require("axios").default
const groupServiceAddress = process.env.GROUP_SERVICE_ADDRESS || "localhost:3002"
const questionServiceAddress = process.env.QUESTION_SERVICE_ADDRESS || "localhost:3004"
class TestController {
    getTestInfo(req, res, next) {

        Tests.findOne({_id: req.query.testId})
            .then(testInfo => {
                console.log(testInfo)
                res.json(testInfo)
            })
            .catch(next)
    }

    getTestInfoById(req, res, next) {

        Tests.findOne({_id: req.query.testId})
            .then(testInfo => {
                res.json(testInfo)
            })
    }

    getAllTest(req, res, next) {
        Tests.find({groupId: req.query.groupId})
            .then(testInfo => {
                res.json(testInfo)
            })
    }

    getTest(req, res, next) {
        axios.get(`${questionServiceAddress}/group/question/test?testId=${req.query.testId}`)
            .then(response => {
                for(let question of response.data) {
                    delete question.correct
                }
                res.json(response.data)
            })
    }

    addTest(req, res, next) {
        req.body.number = 0
        req.body.class = Number(req.body.class)
        req.body.time = Number(req.body.time)
        var test = new Tests(req.body)
        axios.get(`${groupServiceAddress}/group?groupId=${req.body.groupId}`)
        test.save()
            .then((test) => {
                res.json({success: true, test})
            })
            .catch(next)
    }

    increaseQuestionNumber(req, res, next) {
        Tests.findOne({_id: req.query.testId})
            .then((test) => {
                test.number += 1
                return Tests.updateOne({_id: req.query.testId}, test)
            })
            .then(() => {
                res.json({success: true})
            })
    }

    updateTest(req, res, next) {
        Tests.updateOne({_id: req.query.testId}, req.body)
            .then(test => res.json({success: true, test}))
            .catch(next)
    }

    deleteTest(req, res, next) {
        Tests.deleteOne({_id: req.query.testId})
            .then(() => {res.json({success: true})})
            .catch(next)
    }

    deleteAllTest(req, res, next) {
        Tests.find({groupId: req.query.groupId})
            .then(tests => {
                return Promise.all(tests.map(test => axios.delete(`${questionServiceAddress}/group/question/all`, {
                    params: {
                        testId: test._id
                    }
                })))
            })
            .then(() => Tests.deleteMany({groupId: req.query.groupId}))
            .then(() => {res.json({success: true})})
            .catch(next)
    }

    async result(req, res, next) {
        let result = 0
        for(let question of req.body.test) {
            let response = await axios.get(`${questionServiceAddress}/group/question`, {
                params: {
                    questionId: question.questionId
                }
            })
            response.data = response.data[0]
            console.log(response.data)

            if(response.data.correct == question.answer) {
                ++result
            }
            if(req.body.test.indexOf(question)+1 == req.body.test.length) {
                Tests.findOne({_id: req.body.testId})
                    .then(test => {
                        result = result/test.number
                        result = Number.isInteger(result) ? result * 10 : result.toFixed(2) * 10;
                        res.json(result)
                    })
            }
        }
    }
}

module.exports = new TestController;
