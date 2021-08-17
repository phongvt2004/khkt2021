module.exports = function checkTypeQuestion(req, res, next) {
    if (req.query.type) {
        next()
    } else if(req.query.type == 'system') {
        res.body.isSystem = true
    } else {
        res.body.isSystem = false
    }
    next()
}