const TestRank = require('../models/testRank')
const Rank = require('../models/rank')
const GroupRank = require('../models/groupRank')
const UserRank = require('../models/userRank')
const groupServiceAddress = process.env.SEARCH_SERVICE_ADDRESS || 'localhost:3013'
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || 'localhost:3006';
const axios = require('axios').default
class RankController {
    async addTestRank(req, res, next) {
        let times = ['21:30:20', '20:40:50', '21:30:40', '20:40:10']
        for(let i = 0; i < 11; i+=0.5) {
            for(let time of times) {
                let rank = new TestRank({
                    point: i,
                    time
                })
                await rank.save()
                if(i == 10 && time == '20:40:10') {
                    res.json('ok')
                }
            }
        }
    }

    getTestRank(req, res, next) {
        let perLoad = 15;
        let load = req.query.load || 1;
        TestRank.find({})
            .sort({'point': -1, 'time': 1})
            .skip((perLoad * load) - perLoad)
            .limit(perLoad)
            .exec((err, testRank) => {
                res.json(testRank)
            });
    }

    createRankGroup(req, res, next) {
        req.body.point = 0
        req.body.time = ''
        let rankGroup = new GroupRank(req.body)
        Rank.findOne({index: 'group'})
            .then(rank => {
                rank.value.push(req.body.groupId)
                Promise.all([
                    Rank.updateOne({index: 'group'}, rank),
                    rankGroup.save()
                ])
            })
            .then(() => res.json('ok'))
            .catch(next)
    }

    createRankUser(req, res, next) {
        req.body.point = 0
        req.body.time = ''
        let rankUser = new UserRank(req.body)
        Rank.findOne({index: 'user'})
            .then(rank => {
                rank.value.push(req.body.userId)
                Promise.all([
                    Rank.updateOne({index: 'user'}, rank),
                    rankUser.save()
                ])
            })
            .then(() => res.json('ok'))
            .catch(next)
    }

    updateRankGroup(req, res, next) {
        Promise.all([
            GroupRank.find({}).sort({'point': -1, 'time': 1}),
            Rank.findOne({index: 'group'})
        ])
        .then(([groups, rank]) => {
            groups = groups.map((group, index) => {
                group.rank = index + 1
                return group
            })
            let groupRank = groups.map(group => group.groupId)
            let updateRank = groupRank.filter((groupId, index) => rank.value.indexOf(groupId)!= index)
            let updateGroupRank = groups.filter(group => updateRank.includes(group.groupId))
            rank.value = groupRank
            return Promise.all([
                ...updateGroupRank.map(group => GroupRank.updateOne({groupId: group.groupId}, group)),
                ...updateGroupRank.map(group => axios.patch(`${groupServiceAddress}/update/rank`, {groupId: group.groupId, rank: group.rank})),
                Rank.updateOne({index: 'group'}, rank)
            ])
        })
        .then(() => {res.json({success: true})})
        .catch(next)
    }

    updateGroup(req, res, next) {
        GroupRank.findOne({groupId: req.body.groupId})
            .then(group => {
                group.point += parseInt(req.body.point)
                let [currentMin, currentSec, currentMs] = group.time.split(':').map(item => parseInt(item))
                let [min, sec, ms] = req.body.time.split(':').map(item => parseInt(item))
                let totalMs = (currentMin + min)*60*1000 + (currentSec+sec)*1000 + currentMs + ms
                let newMs = totalMs%1000
                let newSec = ((totalMs - newMs)/1000)%60
                let newMin = (totalMs - newSec*1000 - newMs)/1000/60
                group.time = `${newMin}:${newSec}:${newMs}`
                return GroupRank.updateOne({groupId: group.groupId}, group)
            })
            .then(next)
            .catch(res.json)
    }

    updateUser(req, res, next) {
        UserRank.findOne({groupId: req.body.groupId})
            .then(user => {
                user.point += parseInt(req.body.point)
                let [currentMin, currentSec, currentMs] = user.time.split(':').map(item => parseInt(item))
                let [min, sec, ms] = req.body.time.split(':').map(item => parseInt(item))
                let totalMs = (currentMin + min)*60*1000 + (currentSec+sec)*1000 + currentMs + msthể
                let newMs = totalMs%1000
                let newSec = ((totalMs - newMs)/1000)%60
                let newMin = (totalMs - newSec*1000 - newMs)/1000/60
                user.time = `${newMin}:${newSec}:${newMs}`
                return UserRank.updateOne({userId: user.userId}, user)
            })
            .then(next)
            .catch(res.json)
    }

    updateRankUser(req, res, next) {
        Promise.all([
            UserRank.find({}).sort({'point': -1, 'time': 1}),
            Rank.findOne({index: 'group'})
        ])
        .then(([users, rank]) => {
            users = users.map((user, index) => {
                user.rank = index + 1
                return user
            })
            let userRank = users.map(user => user.userId)
            let updateRank = userRank.filter((userId, index) => rank.value.indexOf(userId)!= index)
            let updateUserRank = users.filter(user => updateRank.includes(user.userId))
            rank.value = userRank
            return Promise.all([
                ...updateUserRank.map(user => UserRank.updateOne({userId: user.userId}, user)),
                ...updateUserRank.map(user => axios.patch(`${userServiceAddress}/update/rank`, {userId: user.userId, rank: user.rank})),
                Rank.updateOne({index: 'user'}, rank)
            ])
        })
        .then(() => {res.json({success: true})})
        .catch(next)
    }
}

module.exports = new RankController;
