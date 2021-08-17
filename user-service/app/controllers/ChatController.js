const Chats = require('../models/chats')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads/message')
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage }).single('files')

class ChatController {
    getAllChatMessage(req, res, next) {
        Chats.find({groupId: req.query.groupId})
            .then(chats => res.json(chats))
    }

    getChatMessage(chatId) {
        return Chats.findOne({_id: chatId})
    }

    uploadFile(req, res, next) {
        upload(req, res, err => {
            if(err) return res.json({success: false, err})
            return res.json({success: true, url: res.req.file.path})
        })
    }

    createChatMessage(chat) {
        let chats = new Chats(chat)
        return chats.save()
    }

    updateChatMessage(chatId, newChat) {
        return Chats.updateOne({_id: chatId}, newChat)
            .then(() => chatId)
    }

    deleteChatMessage(chatId) {
        return Chats.deleteOne({_id: chatId})
    }
}

module.exports = new ChatController