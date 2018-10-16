const express = require('express');
const socket = require('socket.io');
const path = require('path');
const http = require('http');
const mongo = require('mongoose');

//starting server and sockets
const app = express();
const server = http.createServer(app);
const io = socket.listen(server);

//config to server
const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000
};

const mongoURI = process.env.MONGODB_URI;
//db connect
mongo.connect('mongodb://localhost/chatdb', {mongoURI,useNewUrlParser: true, option}).then(db => console.log('db is connected'))
    .catch(err => console.log(err));
//static files
app.use(express.static(path.join(__dirname, 'public')));
//setting
app.set('port', process.env.PORT || 3000);
//call sockets
require('./sockets')(io);

//start server
server.listen(app.get('port'), () => {
    console.log(`server on port:`, app.get('port'));
});