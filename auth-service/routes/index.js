const AuthController = require('../app/controllers/AuthController')
function route(app) {
    app.post('/login', (req, res, next) => {
        console.log('ok')
        next()
    },AuthController.login)
    app.post('/register', AuthController.registerConfirm, AuthController.register)
    app.get('/logout', AuthController.logout)
    app.get('/check/token', AuthController.checkToken)
    app.get('/update/token', AuthController.updateToken)
    app.get('/', (req, res) => {
        res.json('auth')
    })
}

module.exports = route;
