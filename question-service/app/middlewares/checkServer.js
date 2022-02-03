
const mc = require('../../config/memcached');

function checkServer(req, res, next) {
    if(req.query?.server) {
        mc.get('server', function(err, token) {
            if(req.query.serverToken === token.toString()) {
                next()
            } else {
                res.json('Wrong server token')
            }
        })
    }
}

module.exports = checkServer;