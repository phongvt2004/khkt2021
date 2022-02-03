const Groups = require('../models/groups')
const memberServiceAddress = process.env.MEMBER_SERVICE_ADDRESS || 'localhost:3005';
const searchServiceAddress = process.env.SEARCH_SERVICE_ADDRESS || 'localhost:3013'
const userServiceAddress = process.env.USER_SERVICE_ADDRESS || 'localhost:3006';
const axios = require('axios').default

async function handleHasSubject(req, res, next) {
    return new Promise((resolve, reject) => {
        Groups.findOne({_id: req.body.groupId})
        .then((group) => {
            return Promise.all([...group.memberIds, group.leaderId].map(userId => axios.get(`${userServiceAddress}/users/goodAt`, {
                params: {
                    userId
                }
            })))
        })
        .then(response => response.map(res => res.data))
        .then(goodAtArray => goodAtArray.flat(Infinity))
        .then(goodAtArray => Array.from(new Set(goodAtArray)))
        .then(hasSubject => {
            resolve(hasSubject)
        })
    })
}

async function handleRequiredSubject(req, res, next) {
    return new Promise((resolve, reject) => {
        Groups.findOne({_id: req.body.groupId})
        .then((group) => {
            return Promise.all([...group.memberIds, group.leaderId].map(userId => axios.get(`${userServiceAddress}/users/badAt`, {
                params: {
                    userId
                }
            })))
        })
        .then(response => response.map(res => res.data))
        .then(badAtArray => badAtArray.flat(Infinity))
        .then(badAtArray => Array.from(new Set(badAtArray)))
        .then(requiredSubject => {
            resolve(requiredSubject)
        })
    })
}

module.exports = {handleHasSubject, handleRequiredSubject}