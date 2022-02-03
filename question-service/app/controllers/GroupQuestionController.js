
const groupQuestions = require("../models/groupQuestion")
const testServiceAddress = process.env.TEST_SERVICE_ADDRESS || "localhost:3004";
const axios = require('axios').default
class GroupQuestionController {
    getQuestionTest(req, res, next) {
        groupQuestions.find({testId: req.query.testId})
            .then((questions) => {
                res.json(questions)
            })
    }

    getQuestion(req, res, next) {
        groupQuestions.find({_id: req.query.questionId})
            .then(question => {
                res.json(question)
            })
    }

    addQuestion(req, res, next) {
        axios.get(`${testServiceAddress}/group/test/server`, {
            params: {testId: req.body.testId}
        })
        .then(response => response.data)
        .then(test => {
            console.log(test)
            req.body.class = test.class
            req.body.subject = test.subject
            var question = new groupQuestions(req.body)
            return question.save()
        })
        .then(() =>{
            console.log('ok')
            return axios.patch(`${testServiceAddress}/group/test/addQuestion?testId=${req.body.testId}`)
        })
        .then(() => {
            console.log('response')
            res.json({success: true})
        })
        .catch(err => res.json({err}))
    }

    updateQuestion(req, res, next) {
        groupQuestions.updateOne({_id: req.query.questionId}, req.body)
            .then(() => res.json({success: true}))
            .catch(err => res.json({err}))
    }

    deleteQuestion(req, res, next) {
        groupQuestions.deleteOne({_id: req.query.questionId})
            .then(() => res.json({success: true}))
            .catch(err => res.json({err}))
    }

    deleteAllQuestion(req, res, next) {
        groupQuestions.deleteMany({testId: req.query.testId})
            .then(() => res.json({success: true}))
    }
}

module.exports = new GroupQuestionController;