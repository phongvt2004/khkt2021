
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const randtoken = require('rand-token');
const redis = require('redis')
const redisHost = process.env.REDIS_HOST || 'localhost'
const redisPort = process.env.REDIS_PORT || 6379
const client = redis.createClient(redisPort, redisHost)

const saltRounds = 10;

class AuthController {
    login(req, res, next) {
        Users.findOne({username: req.body.username})
            .then(user => {
                if(user) {
                    bcrypt.compare(req.body.password, user.password)
                        .then(function(result) {
                            if(result) {
                                res.json({success: true, username: user.username, token: randtoken.generate(16), msg: "Auth success"})
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
                        res.json({username: user.username, token: randtoken.generate(16)})
                    })
                    .catch(next)
            })
    }

    registerConfirm(req, res, next) {
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

module.exports = new AuthController;