const GroupController = require('../app/controllers/GroupController')
const {checkUser} = require('../app/middlewares/checkUser')
const checkServer = require('../app/middlewares/checkServer')
const checkLeader = require('../app/middlewares/checkLeader')
function route(app) {
    app.get('/group/server', GroupController.getGroup)
    app.get('/group/name', GroupController.getGroupByName)
    app.get('/group', checkUser, GroupController.getGroup)
    app.post('/group', checkUser, GroupController.createGroupConfirm, GroupController.createGroup)
    app.put('/group', checkUser, GroupController.updateGroup)
    app.patch('/group', checkUser, GroupController.updateGroup)
    app.put('/group/server', GroupController.updateGroup)
    app.delete('/group', checkUser, checkLeader, GroupController.deleteGroup)
    app.patch('/group/reset/subject', GroupController.resetSubject)
    app.post('/group/join', checkUser, GroupController.joinGroup)
    app.patch('/group/deny', checkUser, checkLeader, GroupController.denyJoinGroup)
    app.patch('/update/rank', GroupController.updateRank)
    app.get('/', (req, res) => {
        res.json('group')
    })
}

module.exports = route;
