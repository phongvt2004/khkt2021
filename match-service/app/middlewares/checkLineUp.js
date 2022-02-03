const LineUp = require('../models/lineUp')

function checkLineUp(req, res, next) {
    LineUp.findOne({groupId: req.body.groupId})
        .then(group => {
            let isInLineUp = group.team.some(user => user.username == req.query.username)
            if(isInLineUp) {
                next()
            } else {
                res.json('Not in line up')
            }
        })
}

module.exports = checkLineUp