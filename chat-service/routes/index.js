const ChatController = require('../app/controllers/ChatController')
const {checkUser} = require('../app/middlewares/checkUser')
function route(app) {
    app.get('/chat', checkUser, ChatController.getAllChatMessage)    
    app.get('/new/chat', checkUser, ChatController.getNewChats)    
    app.get('/last/read', checkUser, ChatController.getLastReaded)    
    app.post('/chat', ChatController.createChatMessage)    
    app.delete('/chat', ChatController.deleteChatMessage)
    app.delete('/all/chat', ChatController.deleteAllChatMessage)
    app.patch('/new/chat', ChatController.newChats)
    app.patch('/last/read', ChatController.lastReaded)
    app.patch('/update/read', ChatController.addReaded)
    app.get('/', (req, res) => {
        res.json('chat')
    })
}

module.exports = route;
