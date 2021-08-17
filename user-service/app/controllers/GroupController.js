const Groups = require('../models/groups')

class GroupController {
    getGroup(req, res, next) {
        Groups.findOne({name: req.params.name})
            .then((group) => {res.json(group)})
    }
    createGroup(req, res, next) {
        const group = new Groups(req.body)
        group
            .save()
            .then((group) => {res.json(group)})
            .catch(next)
    }

    createGroupConfirm(req, res, next) {
        Groups.findOne({name: req.body.name})
            .then(user => {
                if(!user) {
                    next();
                } else {
                    res.json({msg: 'Name already exists'})
                }
            })
            .catch(next)
    }

    updateGroups(req, res, next) {
        Groups.updateOne({_id: req.params.id}, req.body)
            .then(res.json({success: true}))
            .catch(next)
    }

    deleteGroup(req, res, next) {
        Groups.deleteOne({_id: req.params.id})
            .then(res.json({success: true}))
            .catch(next)
    }
}

module.exports = new GroupController;