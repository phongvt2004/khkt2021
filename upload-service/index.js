const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())
require('dotenv').config({
  path: '.env.example'
})
const port = process.env.PORT || 3010;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const route = require('./routes')
const db = require('./config/db');

db.connect();

route(app);


const https = require('https');
const fs = require('fs-extra');
var options = {
  key: fs.readFileSync('./client-key.pem'),
  cert: fs.readFileSync('./client-cert.pem')
};
var http = require('http');
http.createServer(app).listen(port)
