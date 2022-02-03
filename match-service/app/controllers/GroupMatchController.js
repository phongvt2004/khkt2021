const GroupMatchTest = require('../models/groupMatchTest')
const LineUp = require('../models/lineUp')
const memberServiceAddress = process.env.MEMBER_SERVICE_ADDRESS || 'localhost:3005';
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || 'localhost:3006';
const testServiceAddress = process.env.TEST_SERVICE_ADDRESS || 'localhost:3004';
const subjects = [
    "Toán",
    "Ngữ văn",
    "Sinh học",
    "Vật lý",
    "Hóa học",
    "Lịch sử",
    "Địa lý",
    "Tiếng Anh",
    "Công nghệ",
    "GDCD",
    "Tin học",
]
const axios = require('axios').default
class GroupMatchController {
    createLineUp(req, res, next) {
        req.body.team = subjects.map(subject => {
            return {
                subject,
                username: '',
                userId: '',
                status:'',
                done: false,
            }
        })
        let lineUp = new LineUp(req.body)
        lineUp.save()
            .then(() => res.json('done'))
            .catch(next)
    }
    
    updateLineUp(req, res, next) {
        LineUp.findOne({groupId: req.body.groupId})
            .then(group => {
                group.team = group.team.filter(user => {
                    if(user.subject == req.body.subject) {
                        user.username = req.query.username
                        user.userId = req.body.userId
                    }
                    return user
                })
                return LineUp.updateOne({_id: group._id}, group)
            })
            .then(() => res.json('done'))
            .catch(next)
    }

    async createTestGroupMatch(subject, grade) {
        return axios.post(`${testServiceAddress}/system/test/group/match`, {
            subject,
            class: grade
        })
        .then(response => response.data)
        .then(test => {
            MatchTest.findOne({subject, class: grade})
                .then(matchTest => {
                    if(!matchTest) {
                        let newTest = new GroupMatchTest(test)
                        return newTest.save()
                    } else {
                        matchTest.questionList = test.questionList
                        return GroupMatchTest.updateOne({_id: matchTest._id}, matchTest)
                    }
                })
                .then(console.log)
                .catch(console.error)
        })
    }

    getTestGroupMatch(req, res, next) {
        LineUp.findOne({groupId: req.query.groupId})
            .then(lineUp => {
                let [user] = lineUp.team.filter(user => user.username == req.query.username)
                return GroupMatchTest.findOne({class: lineUp.class, subject: user.subject})  
            })
            .then(res.json)
            .catch(next)
    }
}

module.exports = new GroupMatchController;
