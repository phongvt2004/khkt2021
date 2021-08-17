const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const cors = require('cors');
const port = 8080;
const ChatController = require('./app/controllers/ChatController')

app.use('/api', cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const route = require('./routes')
const db = require('./config/db');

db.connect();

app.use(express.static(path.join(__dirname, 'uploads', 'message')));
app.use(express.static(path.join(__dirname, 'uploads', 'questions')));
route(app);

io.on('connection', function(socket){
  socket.on('inputChatMessage', function(chat){
    ChatController.createChatMessage(chat)
      .then((chat) => {
        socket.emit('outputChatMessage', chat);
      })
  });
  socket.on('changeChatMessage', function(chat){
    ChatController.updateChatMessage(chat)
      .then((chatId) => {
        return ChatController.getChatMessage(chatId)
      })
      .then((chat) => socket.emit('newChatmessage', chat))
  });
  socket.on('deleteChatMessage', function(chatId){
    ChatController.createChatMessage(chatId)
      .then(() => {
        socket.emit('deletedChatMessage', true);
      })
  });
  socket.on('notifyUser', function(user){
    socket.emit('notifyUser', user);
  });
  
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})