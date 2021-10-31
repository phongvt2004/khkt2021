const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const port = 3009;
const ChatController = require('./app/controllers/ChatController')
const KafkaController = require('./app/controllers/KafkaController')
app.use('/api', cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const route = require('./routes')
const db = require('./config/db');

db.connect();
route(app);

KafkaController.consumer('createChatMessage')
  .then(message => {
    ChatController.createChatMessage(message.value)
  })

KafkaController.consumer('deleteChatMessage')
  .then(message => {
    ChatController.deleteChatMessage(message.value)
  })

app.listen(port)