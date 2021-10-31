const NotifyController = require('../app/controllers/NotifyController')
function route(app) {
    app.get('/api/user/notifications', NotifyController.getAllNotify)
    app.post('/api/user/notifications', NotifyController.createNotify)
}

module.exports = route;