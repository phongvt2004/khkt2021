const Groups = require('../models/groups')
const Users = require('../models/users')

class MemberController {
    getMemberList(req, res, next) {
        Groups.findOne({name: req.params.name})
            .then(async function getMembers(group) {
                let members = group.memberIds;
                await members.reducer(getUser, [])
                async function getUser(usersList, userId) {
                    await Users.findOne({_id: userId})
                        .then(user => {usersList. push(user)})
                    return usersList
                }
                return members
            })
            .then(members => res.json(members))
            .catch(next)
    }

    addMember(req, res, next) {
        Promise.all([
            Groups.findOne({name: req.body.groupname}),
            Users.findOne({username: req.body.username})
        ])
        .then(([group, user]) => {
            group.memberIds.push(user._id);
            group.memberNumber++;
            user.groupIds.push(group._id)
            return Promise.all([
                Groups.updateOne({_id: group._id}, group),
                Users.updateOne({_id: user._id}, user)
            ])
        })
        .then(([group, user]) => {
            res.json({group, user})
        })
        .catch(next)
    }

    deleteMember(req, res, next) {
        Promise.all([
            Groups.findOne({name: req.body.groupname}),
            Users.findOne({username: req.body.username})
        ])
        .then(([group, user]) => {
            group.memberIds = group.memberIds.filter((id) => {
                return id != user._id
            })
            group.memberNumber--;
            user.memberIds = user.groupIds.filter((id) => {
                return id != group._id
            })
            return Promise.all([
                Groups.updateOne({_id: group._id}, group),
                Users.updateOne({_id: user._id}, user)
            ])
        })
        .then(([group, user]) => {
            res.json({group, user})
        })
        .catch(next)
    }
}

module.exports = new MemberController;