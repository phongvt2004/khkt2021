
const axios = require("axios").default
const questionServiceAddress = process.env.QUESTION_SERVICE_ADDRESS || "localhost:3004"
const historyServiceAddress = process.env.HISTORY_SERVICE_ADDRESS || "localhost:3004"
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || "localhost:3004"
const groupServiceAddress = process.env.GROUP_SERVICE_ADDRESS || "localhost:3004"
class SystemTestController {
    getTestUserMatch(req, res, next) {
        let grade
        axios.get(`${userServiceAddress}/users/server`, {
            params: {
                username: req.query.username
            }
        })
        .then((response) => {
            grade = response.data.class
            return axios.post(`${questionServiceAddress}/system/question/user/match`, {
                class: response.data.class,
            })
        })
        .then(async (response) => {
            res.json(response.data)
        })
        .catch(next)
    }

    getTestGroupMatch(subject, grade) {
        axios.post(`${questionServiceAddress}/system/question/group/match`, {
            subject: req.body.subject,
            class: req.body.class,
        })
        .then(async (response) => {
            res.json(response.data)
        })
        .catch(next)
    }
    getTest(req, res, next) {
        let grade
        axios.get(`${userServiceAddress}/users/server`, {
            params: {
                username: req.query.username
            }
        })
        .then((response) => {
            grade = response.data.class
            return axios.post(`${questionServiceAddress}/system/question/test`, {
                class: response.data.class,
                subject: req.body.subject,
                number: req.body.number,
                time: req.body.time,
            })
        })
        .then(async (response) => {
            let createAt = new Date()
            console.log('ok')
            await axios.post(`${historyServiceAddress}/test`, {
                username: req.query.username,
                class: grade,
                subject: req.body.subject,
                time: req.body.time,
                test: response.data.questionList,
                createAt: createAt.toString()
            })
            res.json(response.data)
        })
        .catch(next)
    }

    async result(req, res, next) {
        try {
            let result = 0
            let response = await axios.get(`${userServiceAddress}/users/server`, {
                params: {
                    username: req.query.username
                }
            })
            let grade = response.data.class
            for(let question of req.body.test) {
                console.log(question)
                response = await axios.get(`${questionServiceAddress}/system/question/server`, {
                    params: {
                        questionId: question.questionId
                    }
                })
                if(response.data.correct == question.answer) {
                    ++result
                }
                console.log(req.body.test.indexOf(question)+1, req.body.test.length)
                if(req.body.test.indexOf(question)+1 == req.body.test.length) {
                    console.log('ok')
                    result = result/req.body.test.length
                    result = Number.isInteger(result) ? result * 10 : result.toFixed(2) * 10;
                    let resultResponse = await axios.post(`${historyServiceAddress}/result/history`, {
                        class: grade,
                        subject: req.body.subject,
                        point: result,
                        time: req.body.time,
                    }, {
                        params: {
                            username: req.query.username,
                            token: req.query.token
                        }
                    })
                    console.log('ok1')
                    result = resultResponse.data
                    let historyResponse = await axios.post(`${historyServiceAddress}/test/history`, {
                        class: grade,
                        subject: req.body.subject,
                        resultId: result._id,
                        test: req.body.test,
                        createAt: req.body.createAt
                    }, {
                        params: {
                            username: req.query.username,
                            token: req.query.token
                        }
                    })
                    console.log('ok2')
                    let history = historyResponse.data
                    res.json({result, history})
                } else {
                    console.log('ok')
                }
            }
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
}

module.exports = new SystemTestController;