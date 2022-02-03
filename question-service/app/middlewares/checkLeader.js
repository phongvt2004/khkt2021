const axios = require('axios').default
const groupServiceAddress = process.env.GROUP_SERVICE_ADDRESS || 'localhost:3003';
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || 'localhost:3006'
function checkLeader(req, res, next) {
    Promise.all([
        axios.get(`${groupServiceAddress}/group`, {
            params: {
                username: req.query.username,
                token: req.query.token,
                groupId: req.query.groupId
            }
        }),
        axios.get(`${userServiceAddress}/users/server`, {
            params: {
                username: req.query.username,
            }
        })
    ])
    .then((response) => {
        return response.map(res => res.data);
    })
    .then(([group, user]) => {
        if(group.leaderId == user.userId) {
            next()
        } else {
            res.json({msg: "You have to be a leader to do this"})
        }
    })
    .catch((err) => {res.json(err)})
}

module.exports = checkLeader;
