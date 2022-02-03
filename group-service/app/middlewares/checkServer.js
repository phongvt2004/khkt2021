
const mc = require('../../config/memcached');

function checkServer(req, res, next) {
    if(req.params?.server) {
        mc.get('server', function(err, token) {
            if(req.params.serverToken === token.toString()) {
                next()
            } else {
                res.json('Wrong server token')
            }
        })
    }
}

module.exports = checkServer;