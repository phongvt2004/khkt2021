const Users = require('../models/users');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

module.exports = function checkAdmin(req, res, next) {
    var username = myCache.get('username')
    Users.findOne({ username: username})
        .then((user) => {
            if(user.isAdmin) {
                next()
            } else {
                res.json({isAdmin: false})
            }
        })
}