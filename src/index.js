const express = require('express');
const socket = require('sockets');
const path = require('path');
const http = require('http');
const mongo = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socket.listen(server);


//db connect
mongo.connect('mongodb://localhost:27017/chatdb', {useNewUrlParser: true}).then(db => console.log('db is connected'))
    .catch(err => console.log(err));
//static files
app.use(express.static(path.join(__dirname, 'public')));
//setting
app.set('port', process.env.PORT || 3000);
require('./sockets')(io);

//start server
server.listen(app.get('port'), () => {
    console.log(`server on port:`, app.get('port'));
});