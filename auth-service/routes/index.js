const AuthController = require('../app/controllers/AuthController')

function route(app) {
    app.post('/api/login', AuthController.login)
    app.post('/api/register', AuthController.registerConfirm, AuthController.register)
}