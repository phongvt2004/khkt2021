const UserMatchTest = require('../models/userMatchTest')
const memberServiceAddress = process.env.MEMBER_SERVICE_ADDRESS || 'localhost:3005';
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || 'localhost:3006';
const testServiceAddress = process.env.TEST_SERVICE_ADDRESS || 'localhost:3004';
const axios = require('axios').default
class UserMatchController {
    async createTestUserMatch(grade) {
        return axios.post(`${testServiceAddress}/system/test/user/match`, {
            class: grade
        })
        .then(response => response.data)
        .then(test => {
            return MatchTest.findOne({})
                .then(matchTest => {
                    if(!matchTest) {
                        let newTest = new UserMatchTest(test)
                        return newTest.save()
                    } else {
                        matchTest.questionList = test.questionList
                        return UserMatchTest.updateOne({_id: matchTest._id}, matchTest)
                    }
                })
            })
        .then(console.log)
        .catch(console.error)
        }
    
    getTestUserMatch(req, res, next) {
        axios.get(`${userServiceAddress}/users/server`, {
            params: {
                username: req.query.username
            }
        })
        .then(response => {
            UserMatchTest.findOne({class: response.data.class})
            .then(res.json)
            .catch(next)
        })
    }
}

module.exports = new UserMatchController;
