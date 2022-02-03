const axios = require('axios').default
const authServiceAddress = process.env.AUTH_SERVICE_ADDRESS || 'localhost:3001'
function checkUser(req, res, next) {
    console.log('ok')
    axios.get(`${authServiceAddress}/check/token`, {
        params: {
            username: req.query.username,
            token: req.query.token
        }
    })
        .then(response => {
            if (response.data.success) {
                next()
            } else {
                res.json('Wrong token')
            }
        })
        .catch(err => res.json(err))
}

module.exports = {checkUser};