const axios = require('axios').default
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || 'localhost:3006';
function checkAdmin(req, res, next) {
    axios.get(`${userServiceAddress}/users/server`, {
        params: {
            username: req.query.username,
        }
    })
    .then(response => response.data)
    .then(user => {
        if(user.isAmin) {
            next();
        } else {
            res.json({msg: 'You are not an admin'})
        }
    })
    .catch((err) => {res.json(err)})
}

module.exports = checkAdmin
