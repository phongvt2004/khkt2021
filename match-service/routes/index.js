const GroupMatchController = require('../app/controllers/GroupMatchController')
const {checkUser} = require('../app/middlewares/checkUser')
const checkLeader = require('../app/middlewares/checkLeader')
const {checkTimeUser, checkTimeGroup, checkTimeLineUp} = require('../app/middlewares/checkTime')
function route(app) {
    app.post('/create/lineup', GroupMatchController.createLineUp)
    app.put('/update/lineup', checkUser, GroupMatchController.updateLineUp)
    app.get('/', (req, res) => {
        res.json('match')
    })
}

module.exports = route;
