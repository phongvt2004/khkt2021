
const UserStatus = require('../models/userStatus');
const Users = require('../models/usersInfo');
const groupServiceAddress = process.env.GROUP_SERVICE_ADDRESS
const axios = require('axios').default;
class UserController {
    getUser(req, res, next) {
        Users.findOne({username: req.query.username})
            .then(user => {
                UserStatus.findOne({userId: user._id})
                    .then(userStatus => {
                        res.json({
                            userId: user._id,
                            avatar: user?.avatar ? user.avatar : '',
                            fullname: user.fullname,
                            username: user.username,
                            email: user.email,
                            gender: user.gender,
                            class: user.class,
                            goodAt: user.goodAt,
                            badAt: user.badAt,
                            inGroups: userStatus.inGroups,
                            waitGroups: userStatus.waitGroups,
                            isConfirmMail: userStatus.isConfirmMail,
                            isAmin: userStatus.isAmin,
                            systemScores: userStatus.systemScores,
                        })
                    })
            })
            .catch(next)
    }
    getUserInfo(req, res, next) {
        
        Users.findOne({username: req.query.username})
            .then(user => {
                res.json({
                    userId: user._id,
                    avatar: user?.avatar ? user.avatar : '',
                    fullname: user.fullname,
                    username: user.username,
                    email: user.email,
                    gender: user.gender,
                    class: user.class,
                    goodAt: user.goodAt,
                    badAt: user.badAt
                });
            })
            .catch(next)
    }

    getViewUser(req, res, next) {
        Users.findOne({username: req.query.username})
            .then(user => {
                UserStatus.findOne({userId: user._id})
                    .then(userStatus => {
                        res.json({
                            avatar: user?.avatar ? user.avatar : '',
                            fullname: user.fullname,
                            username: user.username,
                            gender: user.gender,
                            class: user.class,
                            goodAt: user.goodAt,
                            badAt: user.badAt,
                            inGroups: userStatus.inGroups,
                            systemScores: userStatus.systemScores,
                        })
                    })
            })
            .catch(next)
    }

    getUserStatus(req, res, next) {
        UserStatus.findOne({userId: req.query.userId})
            .then(userStatus => {
                res.json(userStatus);
            })
            .catch(next)
    }

    getUserByEmail(req, res, next) {
        
        Users.findOne({email: req.query.email})
            .then(user => {
                res.json({
                    avatar: user?.avatar ? user.avatar : '',
                    fullname: user.fullname,
                    username: user.username,
                });
            })
            .catch(next)
    }

    getUserById(req, res, next) {
        
        UserStatus.findOne({userId: req.query.userId})
            .then(userStatus => {
                res.json(userStatus);
            })
            .catch(next)
    }

    getUserByUsername(req, res, next) {
        Users.findOne({username: req.query.username})
            .then(user => UserStatus.findOne({userId: user._id}))
            .then(userStatus => {
                res.json(userStatus);
            })
            .catch(next)
    }

    createUserStatus(req, res, next) {
        req.body.systemScores = []
        req.body.inGroup = []
        req.body.waitGroup = []
        req.body.historySubject = []
        let user = new UserStatus(req.body)
        user.save()
            .then(userStatus => {
                res.json(userStatus);
            })
    }
    updateUserStatus(req, res, next) {
        UserStatus.updateOne({userId: req.body.userId}, req.body)
            .then(() => {
                res.json({success: true})
            })
            .catch(next)
    }

    updateUserInfo(req, res, next) {
        Users.updateOne({username: req.query.username}, req.body)
            .then(() => {
                res.json({success: true})
            })
    }
    addToGroup(req, res, next) {
        UserStatus.findOne({userId: req.body.userId})
            .then(userStatus => {
                userStatus.inGroups.push(req.body.groupId)
                return UserStatus.updateOne({userId: userStatus.userId}, userStatus)
            })
            .then(() => {res.json({success: true})})
    }

    addGoodSubject(req, res, next) {
        let User
        Users.findOne({username: req.body.username})
            .then(user => {
                User = user
                return UserStatus.findOne({userId: user._id})
            })
            .then(user => {
                User.goodAt = req.body.goodAt
                console.log(User)
                return Promise.all([...user.inGroups.map(groupId => axios.patch(`${groupServiceAddress}/group/reset/subject`, {
                    groupId
                })),
                Users.updateOne({username: User.username}, User)
                ])
            })
            .then(() => res.json({success: true}))
    }

    addBadSubject(req, res, next) {
        let User
        Users.findOne({username: req.body.username})
            .then(user => {
                User = user
                return UserStatus.findOne({userId: user._id})
            })
            .then(user => {
                User.badAt = req.body.badAt
                console.log(User)
                return Promise.all([...user.inGroups.map(groupId => axios.patch(`${groupServiceAddress}/group/reset/subject`, {
                    groupId
                })),
                Users.updateOne({username: User.username}, User)
                ])
            })
            .then(() => res.json({success: true}))
    }

    addSystemScores(req, res, next) {
        Users.findOne({userId: req.body.userId})
            .then(user => {
                return UserStatus.findOne({userId: user._id})
            })
            .then(userStatus => {
                userStatus.systemScores.push(req.body.systemHistory)
                return UserStatus.updateOne({userId: userStatus.userId}, userStatus)
            })
            .then(() => {res.json({success: true})})
    }

    addWaitGroup(req, res, next) {
        Users.findOne({username: req.query.username})
            .then(user => {
                return UserStatus.findOne({userId: user._id})
            })
            .then(userStatus => {
                userStatus.waitGroups.push(req.body)
                return UserStatus.updateOne({userId: userStatus.userId}, userStatus)
            })
            .then(() => {res.json({success: true})})
    }

    addHistory(req, res, next) {
        Users.findOne({username: req.body.username})
            .then(user => {
                return UserStatus.findOne({userId: user._id})
            })
            .then(userStatus => {
                userStatus.historySubject.push(req.body.subject)
                return UserStatus.updateOne({_id: userStatus._id}, userStatus)
            })
            .then(() => {res.json({success: true})})
            .catch(next)
    }

    getGoodAt(req, res, next) {
        Users.findOne({_id: req.query.userId})
            .then(user => res.json(user.goodAt))
    }

    getBadAt(req, res, next) {
        Users.findOne({_id: req.query.userId})
            .then(user => res.json(user.badAt))
    }
}

module.exports = new UserController;