const RankController = require('../app/controllers/RankController')
const {checkUser} = require('../app/middlewares/checkUser')
const checkLeader = require('../app/middlewares/checkLeader')
function route(app) {
    app.get('/add', RankController.addTestRank)
    app.get('/test', RankController.getTestRank)
    app.post('/create/rank/group', RankController.createRankGroup)
    app.post('/create/rank/user', RankController.createRankUser)
    app.patch('/update/group/rank', RankController.updateGroup, RankController.updateRankGroup)
    app.patch('/update/user/rank', RankController.updateUser, RankController.updateRankUser)
    app.get('/', (req, res) => {
        res.json('rank')
    })
}

module.exports = route;
