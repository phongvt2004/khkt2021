const moment = require('moment-timezone');
const date = moment().tz("Asia/Ho_Chi_Minh");

function checkTimeUser(req, res, next) {
    let today = date.format('dddd')
    let time = date.format('h')
    if(today == 'Saturday' && time >= 7 && date.format('a') == 'pm') {
        next()
    } else {
        res.json('Not now')
    }
}

function checkTimeGroup(req, res, next) {
    let today = date.format('dddd')
    let time = date.format('h')
    if(today == 'Sunday' && time >= 7 && date.format('a') == 'pm') {
        next()
    } else {
        res.json('Not now')
    }
}

function checkTimeLineUp(req, res, next) {
    let today = date.format('dddd')
    let time = date.format('h')
    if(today == 'Sunday' && time >= 7 && date.format('a') == 'pm') {
        res.json('End time update line up')
    } else {
        next()
    }
}

module.exports = {checkTimeUser, checkTimeGroup, checkTimeLineUp}