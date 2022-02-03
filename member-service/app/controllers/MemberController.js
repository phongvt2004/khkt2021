const axios = require("axios").default
const groupServiceAddress = process.env.GROUP_SERVICE_ADDRESS || 'localhost:3002'
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || 'localhost:3006'
const searchServiceAddress = process.env.SEARCH_SERVICE_ADDRESS || 'localhost:3013'

class MemberController {
    getMemberList(req, res, next) {
        axios.get(`${groupServiceAddress}/group`, {groupId: req.query.groupId})
            .then(response => response.data)
            .then(group => {
                res.json({member: group.memberIds, leader: group.leader});
            })
    }

    addMember(req, res, next) {
        Promise.all([
            axios.get(`${groupServiceAddress}/group`, {
                params: {
                    username: req.query.username,
                    token: req.query.token,
                    groupId: req.query.groupId
                }
            }),
            axios.get(`${userServiceAddress}/users/server`, {
                params: {
                    username: req.query.username,
                }
            })
        ])
        .then(([groupRes, userRes]) => [groupRes.data, userRes.data])
        .then(([group, user]) => {
            group.memberIds.push(user.userId)
            group.joinRequest = group.joinRequest.filter(req => req.username != user.username)
            user.inGroups.push(req.query.groupId)
            user.waitGroups = user.waitGroups.filter(req => req.groupId != group._id)
            let addSubjects = []
            let removeSubjects = []
            for(let goodAt of user.goodAt) {
                if(group.requiredSubjects.includes(goodAt)) {
                    group.requiredSubjects.splice(group.requiredSubjects.indexOf(goodAt), 1)
                    removeSubjects.push({subject: goodAt, state: 'bad'})
                    group.requiredSubjects.push(goodAt)
                    addSubjects.push({subject: goodAt, state: 'good'})
                } else if(!group.hasSubjects.includes(goodAt)) {
                    group.requiredSubjects.push(goodAt)
                    addSubjects.push({subject: goodAt, state: 'bad'})
                }
            }

            for(let badAt of user.badAt) {
                if(!group.hasSubjects.includes(badAt)) {
                    group.requiredSubjects.push(badAt)
                    addSubjects.push({subject: badAt, state: 'bad'})
                }
            }
            console.log('ok')
            return Promise.all([
                axios.patch(`${groupServiceAddress}/group?groupId=${req.query.groupId}&username=${req.query.username}&token=${req.query.token}`,
                    group
                ),
                axios.patch(`${userServiceAddress}/users/status?userId=${user.userId}&username=${req.query.username}&token=${req.query.token}`,
                    user
                )
            ])
        })
        .then(() => {
            res.json({success: true})
        })
        .catch((err) => res.json({error: err}))
    }

    deleteMember(req, res, next) {
        Promise.all([
            axios.get(`${groupServiceAddress}/group`, {
                groupId: req.query.groupId,
            }),
            axios.get(`${userServiceAddress}/users/status?userId=${req.query.userId}`)
        ])
        .then(([groupRes, userRes]) => {return [groupRes.data, userRes.data]})
        .then(([group, user]) => {
            group.memberIds.splice(group.memberIds.indexOf(req.query.userId), 1)
            user.inGroups.splice(user.groupIds.indexOf(req.query.groupId),1)
            
            return Promise.all([
                axios.delete(`${groupServiceAddress}/group?groupId=${req.query.groupId}&username=${req.query.username}&token=${req.query.token}`,
                    group
                ),
                axios.delete(`${userServiceAddress}/users/status?userId=${req.query.userId}&username=${req.query.username}&token=${req.query.token}`,
                    user
                )
            ])
        })
        .then(() => {
            res.json({success: true})
        })
    }

    deleteAllMember(req, res, next) {
        console.log('ok')
        async function removeInGroup(groupId) {
            return new Promise(async function (resolve, reject) {
                let response = await axios.get(`${groupServiceAddress}/group/server`, {
                    params: {
                        groupId
                    }
                })
                let memberIds = [...response.data.memberIds, response.data.leaderId]
                console.log(memberIds)
                response = await Promise.all(memberIds.map(memberId => axios.get(`${userServiceAddress}/users/status`, {
                    params: {
                        userId: memberId,
                        username: req.query.username,
                        token: req.query.token,
                    }
                })))
                let users = response.map(response => response.data)
                users = users.map(user => {
                    user.inGroups = user.inGroups.filter(inGroup => groupId != inGroup)
                    return user
                })
                Promise.all(users.map(user => axios.put(`${userServiceAddress}/users/status`, user)))
                    .then(resolve)
                    .catch(reject)
            })
        }
        async function removeWaitGroup(groupId) {
            return new Promise(async function (resolve, reject) {
                let response = await axios.get(`${groupServiceAddress}/group/server`, {
                    params: {
                        groupId
                    }
                })
    
                let joinRequests = response.data.joinRequest
                response = await Promise.all(joinRequests.map(joinRequest => axios.get(`${userServiceAddress}/users/by/username`, {
                    params: {
                        username: joinRequest,
                    }
                })))
                let users = response.map(response => response.data)
                users = users.map(user => {
                    user.waitGroups = user.waitGroups.filter(waitGroup => groupId != waitGroup)
                    console.log(user)
                    return user
                })
    
                Promise.all(users.map(user => axios.put(`${userServiceAddress}/users/status`, user)))
                    .then(resolve)
                    .catch(reject)
            })
        }
        return Promise.all([
            removeInGroup(req.query.groupId),
            removeWaitGroup(req.query.groupId)
        ])
        .then(() => res.json('ok'))
        .catch(next)
    }
}

module.exports = new MemberController;