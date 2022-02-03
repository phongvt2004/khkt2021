const MemberController = require('../app/controllers/MemberController')
const checkLeader = require('../app/middlewares/checkLeader')
const {checkUser} = require('../app/middlewares/checkUser')
function route(app) {
    app.get('/member', checkUser, MemberController.getMemberList)
    app.post('/member', checkUser, checkLeader, MemberController.addMember)
    app.delete('/member/delete-all', checkUser, checkLeader, MemberController.deleteAllMember)
    app.delete('/member', checkUser, MemberController.deleteMember)
    app.get('/', (req, res) => {
        res.json('member')
    })
}

module.exports = route;