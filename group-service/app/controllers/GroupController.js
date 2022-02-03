const Groups = require('../models/groups')
const memberServiceAddress = process.env.MEMBER_SERVICE_ADDRESS || 'localhost:3005';
const searchServiceAddress = process.env.SEARCH_SERVICE_ADDRESS || 'localhost:3013'
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || 'localhost:3006';
const chatServiceAddress = process.env.CHAT_SERVICE_ADDRESS || 'localhost:3009';
const testServiceAddress = process.env.TEST_SERVICE_ADDRESS || 'localhost:3004';
const axios = require('axios').default
const {handleHasSubject, handleRequiredSubject} = require('./HandleSubject')
class GroupController {

    getGroup(req, res, next) {
        Groups.findOne({_id: req.query.groupId})
            .then((group) => {
                res.json(group)
            })
            .catch(err => {res.json({success: false, err})})
    }

    getGroupByName(req, res, next) {
        Groups.findOne({name: req.query.name})
            .then((group) => {
                res.json(group)
            })
            .catch(err => {res.json({success: false, err})})
    }

    createGroup(req, res, next) {
        axios.get(`${userServiceAddress}/users/info?username=${req.query.username}&token=${req.query.token}`)
            .then((response) => {
                req.body.leaderId = response.data.userId
                req.body.hasSubjects = response.data?.goodAt ? response.data.goodAt : [],
                req.body.requiredSubjects = response.data?.badAt ? response.data.badAt : [],
                req.body.testNumber = 0;
                req.body.memberIds = []
                req.body.class = parseInt(req.body.class)
                const group = new Groups(req.body)
                group.save()
                .then((group) => {
                    Promise.all([
                        axios.patch(`${searchServiceAddress}/suggest/group`, {
                            groupId: group._id,
                            hasSubjects: group.hasSubjects,
                            requiredSubjects: group.requiredSubjects
                        }),
                        axios.patch(`${searchServiceAddress}/search/group`, {name: group.name, groupId: group._id}),
                        axios.post(`${userServiceAddress}/add/group`, {
                            groupId: group._id,
                            userId: response.data.userId
                        })
                    ])
                    res.json(group)
                })
                .catch(next)
            })
        
    }

    createGroupConfirm(req, res, next) {
        Groups.findOne({name: req.body.name})
            .then(group => {
                if(!group) {
                    next();
                } else {
                    res.json({success: false, msg: 'Name already exists'})
                }
            })
            .catch(next)
    }

    updateGroup(req, res, next) {
        Groups.updateOne({_id: req.query.groupId}, req.body)
            .then(res.json({success: true}))
            .catch(next)
    }

    deleteGroup(req, res, next) {
        Groups.findOne({_id: req.query.groupId})
            .then((group) => {
                return Promise.all([
                    axios.delete(`${memberServiceAddress}/member/delete-all`, {
                        params: {
                            groupId: req.query.groupId,
                            username: req.query.username,
                            token: req.query.token,
                        }
                    }),
                    axios.delete(`${searchServiceAddress}/search/group`, {
                        params: {
                            groupId: req.query.groupId,
                        }
                    }),
                    axios.delete(`${searchServiceAddress}/suggest/group`, {
                        params: {
                            groupId: req.query.groupId,
                            username: req.query.username,
                            token: req.query.token,
                        }
                    }),
                    axios.delete(`${chatServiceAddress}/all/chat`, {
                        params: {
                            groupId: req.query.groupId,
                            username: req.query.username,
                            token: req.query.token,
                        }
                    }),
                    axios.delete(`${testServiceAddress}/group/all/test`, {
                        params: {
                            groupId: req.query.groupId,
                            username: req.query.username,
                            token: req.query.token,
                        }
                    }),
                    
                ])
            })
            .then(() => Groups.deleteOne({_id: req.query.groupId}))
            .then(() => res.json({success: true}))
            .catch(next)
    }

    resetSubject(req, res, next) {
        Promise.all([handleHasSubject(req, res, next), handleRequiredSubject(req, res, next)])
            .then(async function ([hasSubjects, requiredSubjects]) {
                requiredSubjects = requiredSubjects.filter(subject => !hasSubjects.includes(subject))
                
                let group = await Groups.findOne({_id: req.body.groupId})
                group.hasSubjects = hasSubjects
                group.requiredSubjects = requiredSubjects
                console.log(group)
                return Promise.all([
                    axios.patch(`${searchServiceAddress}/suggest/group`, {
                        groupId: req.body.groupId,
                        hasSubjects,
                        requiredSubjects
                    }),
                    Groups.updateOne({_id: req.body.groupId}, group)
                ])
            })
            .then(() => {console.log('ok'); res.json({success: true})})
            .catch(err => {res.json(err)})
    }

    joinGroup(req, res, next) {
        Groups.findOne({_id: req.body.groupId})
            .then((group) => {
                if(req.body.userId == group.leaderId) {
                    res.json('You are leader')
                } else if(group.joinRequest.some(user => user.username == req.query.username)) {
                    res.json('you have already requested to join this group')
                } else {
                    group.joinRequest.push({username: req.query.username, results: '', createAt: req.body.createAt, userId: req.body.userId})
                    return Promise.all([
                        axios.patch(`${userServiceAddress}/users/add/waitGroup?username=${req.body.username}`, {
                            groupId: group._id,
                            groupName: group.name
                        }),
                        Groups.updateOne({_id: req.body.groupId}, group)
                    ])
                }
            })
            .then(()=> {res.json({success: true})})
            .catch(err => {res.json({success: false, err})})
    }

    denyJoinGroup(req, res, next) {
        Groups.findOne({_id: req.body.groupId})
            .then((group) => {
                if(req.body.userId == group.leaderId) {
                    res.json('You are leader')
                } else {
                    group.joinRequest = group.joinRequest.filter(user => user.username != req.body.username)
                    return Promise.all([
                        axios.patch(`${userServiceAddress}/users/remove/waitGroup?username=${req.body.username}`, {
                            groupId: group._id
                        }),
                        Groups.updateOne({_id: req.body.groupId}, group)
                    ])
                }
            })
            .then(()=> {res.json({success: true})})
            .catch(err => {res.json({success: false, err})})
    }

    updateRank(req, res, next) {
        Groups.findOne({_id: req.body.groupId})
            .then(group => {
                group.rank = req.body.rank
                return Groups.updateOne({_id: req.body.groupId}, group)
            })
            .then(() => res.json('ok'))
            .catch(next)
    }
}

module.exports = new GroupController;
