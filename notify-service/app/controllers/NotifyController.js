const Notifications = require('../models/notifications')

class ChatController {
    getAllNotify(req, res, next) {
        Notifications.find({userId: req.query.userId})
            .then(notifications => res.json(notifications))
    }

    createNotify(req, res, next) {
        let notifications = new Chats(req.body)
        notifications.save()
            .then((notification) => res.json(notification))
    }
}

module.exports = new ChatController