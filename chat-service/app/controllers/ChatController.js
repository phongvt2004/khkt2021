const Chats = require('../models/chats')
const NewChats = require('../models/newChats')
const lastReadChats = require('../models/lastReadChats')
const axios = require('axios').default
const uploadServiceAddress = process.env.UPLOAD_SERVICE_ADDRESS;
class ChatController {
    getAllChatMessage(req, res, next) {
        let perLoad = 15;
        let load = req.query.load || 1; 
        Chats.find({groupId: req.query.groupId})
            .sort('-createdAt')
            .skip((perLoad * load) - perLoad)
            .limit(perLoad)
            .exec((err, chats) => {
                res.json(chats)
            });
    }


    getNewChats(req, res, next) {
        NewChats.findOne({groupId: req.body.groupId})
            .then(newChat => {
                res.json(newChat)
            })
            .catch(err => res.json(err))
    }

    getLastReaded(req, res, next) {
        lastReadChats.findOne({groupId: req.body.groupId})
            .then(lastReaded => res.json(lastReaded))
            .catch(next)
    }
    createChatMessage(req, res, next) {
        console.log('ok')
        let chats = new Chats(req.body)
        chats.save()
            .then((chat) =>  res.json(chat))
    }

    deleteChatMessage(req, res, next) {
        Chats.findOne({_id: req.query.chatId})
            .then(chat => {
                if(chat.type != 'text') {
                    axios.delete(`${uploadServiceAddress}/upload/messages`, {
                        params: {
                            fileUrl: chat.message
                        }
                    })
                }
                res.send('success')
            })
    }

    deleteAllChatMessage(req, res, next) {
        Chats.deleteMany({groupId: req.query.groupId})
            .then(() => res.send('success'))
            .catch(next)
    }

    newChats(req, res, next) {
        NewChats.findOne({groupId: req.body.groupId})
            .then(oldChat => {
                if(oldChat) {
                    NewChats.updateOne({_id: oldChat._id}, {chatId: req.body._id, groupId: req.body.groupId, readed: [req.body.sender]})
                } else {
                    let newChat = new NewChats({chatId: req.body._id, groupId: req.body.groupId, readed: [req.body.sender]})
                    return newChat.save()
                }
            })
            .then(() => {res.send('success')})
    }

    addReaded(req, res, next) {
        NewChats.findOne({chatId: req.body.chatId})
            .then(chat => {
                chat.readed.push(req.body.username)
                NewChats.updateOne({_id: chat._id}, chat)
            })
    }

    lastReaded(req, res, next) {
        lastReadChats.findOne({groupId: req.body.groupId})
            .then(oldChat => {
                if(oldChat) {
                    lastReadChats.updateOne({_id: oldChat._id}, {chatId: req.body._id, userId: req.body.userId})
                } else {
                    let newChat = new lastReadChats(req.body)
                    newChat.save()
                }
            })
    }
}

module.exports = new ChatController
