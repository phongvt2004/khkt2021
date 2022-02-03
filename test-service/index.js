const express = require('express');
const app = express();
require('dotenv').config({
  path: '.env.example'
})
const cors = require('cors');
const port = process.env.PORT || 3004;
app.use('/', cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const route = require('./routes')
const db = require('./config/db');

db.connect()
  .then(() => {
    route(app);
    const https = require('https');
    const fs = require('fs-extra');
    var options = {
      key: fs.readFileSync('./client-key.pem'),
      cert: fs.readFileSync('./client-cert.pem')
    };
    var http = require('http');
    http.createServer(app).listen(port)
  })

