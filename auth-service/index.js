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

route(app);


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})