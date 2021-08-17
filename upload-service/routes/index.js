const apiRoute = require('./apiRoute');
function route(app) {
    app.use('/api', apiRoute)
    // app.get('/', (req, res, next) => {
    //     res.send('home')
    // })
}

module.exports = route;