const NotifyController = require('../app/controllers/NotifyController')
const {checkUser} = require('../app/middlewares/checkUser')
function route(app) {
    app.get('/notify', checkUser, NotifyController.getAllNotify)
    app.post('/notify', NotifyController.createNotify)
    app.delete('/notify/test', NotifyController.deleteTestNotify)
    app.patch('/notify/isRead', NotifyController.isRead)
    app.get('/', (req, res) => {
        res.json('notify')
    })
}

module.exports = route;