const groupRoute = require('./group')
const systemRoute = require('./system')
function route(app) {
    app.use('/group', groupRoute)
    app.use('/system', systemRoute)
    app.get('/', (req, res) => {
        res.json('question')
    })
}

module.exports = route;