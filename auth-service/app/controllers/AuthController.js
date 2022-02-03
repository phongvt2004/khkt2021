
const Users = require('../models/usersInfo');
const bcrypt = require('bcrypt');
const randtoken = require('rand-token');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache(
    { 
        stdTTL: 0,
        checkperiod: 0,
        deleteOnExpire: false,
    });
const axios = require('axios').default;
const mailServiceAddress = process.env.MAIL_SERVICE_ADDRESS || 'localhost:3009'
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || 'localhost:3006'
const searchServiceAddress = process.env.SEARCH_SERVICE_ADDRESS || 'localhost:3013'
const saltRounds = 10;

class AuthController {
    login(req, res, next) {
            Users.findOne({username: req.body.username})
            .then(user => {
                console.log('login')
                if(user) {
                    bcrypt.compare(req.body.password, user.password)
                        .then(async function(result) {
                            if(result) {
                                let token = randtoken.generate(16)
                                myCache.set(user.username, token, 10)
                                console.log('success')
                                await axios.get(`http://103.90.229.216:30101/update/token`, {
                                    params: {
                                        username: user.username,
                                        token
                                    }
                                })
                                res.json({
                                    success: true, 
                                    username: user.username,
                                    userId: user.id,
                                    token,
                                    msg: user.isAmin ? 'Amin login success' : "User login success"
                                })

                            } else {
                                res.json({success:false, username: "", msg : "Password incorrect"})
                            }
                        });
                } else {
                    res.json({success:false, username: "", msg: "User not found"})
                }
            })
            .catch(next)
    }

    register(req, res, next) {
        bcrypt.hash(req.body['password'], saltRounds)
            .then(function(hash) {
                req.body.password = hash;
                const user = new Users(req.body)
                user
                    .save()
                    .then((user) => {
                        Promise.all([
                            axios.post(`${mailServiceAddress}/send-mail/confirm`, {
                                mail: user.email,
                                mailType: 'confirm',
                            }),
                            axios.post(`${userServiceAddress}/users/status`, {
                                userId: user._id,
                                isAmin: false,
                                isConfirmMail: false,
                            }),
                            axios.patch(`${searchServiceAddress}/search/fullname`, {name: user.fullname, username: user.username}),
                            axios.patch(`${searchServiceAddress}/search/username`, {username: user.username}),
                            axios.patch(`${searchServiceAddress}/search/email`, {email: user.email})
                        ])
                        .then(async () => {
                            console.log('ok')
                            let token = randtoken.generate(16)
                            myCache.set(user.username, token, 0)
                            await axios.get(`http://103.90.229.216:30101/update/token`, {
                                params: {
                                    username: user.username,
                                    token
                                }
                            })
                            res.json({
                                username: user.username, 
                                userId: user._id,
                                token
                            })
                        })
                        .catch(console.log)
                    })
                    .catch(next)
            })
    }

    registerConfirm(req, res, next) {
        if(req.body.password != req.body.confirmPassword) {
            res.json({msg: 'Confirm password incorrect'})
        } else {
            Users.findOne({username: req.body.username})
                .then(user => {
                    if(!user) {
                        Users.findOne({email: req.body.email})
                            .then(user => {
                                if(!user) {
                                    next();
                                } else {
                                    res.json({msg: 'Email already exists'})
                                }
                            })
                        
                    } else {
                        res.json({msg: 'Username already exists'})
                    }
                })
                .catch(next)
        }
    }

    checkToken(req, res, next) {
        let token = myCache.get(req.query.username)
        console.log(token)
        console.log(req.query.token)
        if(token == req.query.token) {
            res.json({success: true})
        } else {
            res.json({success: false})
        }
    }

    reSaveUserToken(req, res, next) {
        myCache.on("expired", function( username, token ){
            console.log('reset')
            myCache.set(username, token, 10)
        })
    }

    test(req, res, next) {
        myCache.get(req.query.username, function(err, token) {
            if(err) {
                res.json({err})
            } else {
                res.json({token: token.toString()})
            }
        })
    }
    logout(req, res, next) {
        myCache.del(req.query.username)
        res.json({msg: 'Logout success'})
    }

    updateToken(req, res, next) {
        myCache.set(req.query.username, req.query.token, 0)
        res.json('ok')
    }
}

module.exports = new AuthController;
