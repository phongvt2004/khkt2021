const Notifications = require('../models/notifications')

class NotifyController {
    getAllNotify(req, res, next) {
        Notifications.find({userId: req.query.userId})
            .then(notifications => res.json(notifications))
    }

    createNotify(req, res, next) {
        req.body.isRead = false
        let notifications = new Notifications(req.body)
        notifications.save()
            .then((notification) => {
                console.log('ok')
                res.json(notification)
            })
    }

    deleteTestNotify(req, res, next) {
        Notifications.deleteOne({
            userId: req.query.userId, 
            testId: req.query.testId,
            type: 'require do test'
        })
            .then(() => res.json('ok'))
            .catch(next)
    }

    isRead(req, res, next) {
        Notifications.findOne({_id: req.query.notifyId})
            .then(notification => {
                notification.isRead = true
                return Notifications.updateOne({_id: req.query.notifyId}, notification)
            })
            .then(() => res.json('ok'))
    }
}

module.exports = new NotifyController
