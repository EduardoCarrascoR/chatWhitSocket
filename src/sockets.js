const Chat = require('./models/Chat');

module.exports = io => {
    let  users = {};
    io.on('connection', async socket => {
        console.log('new user connected');

        let messages = await Chat.find({}).limit(8).sort('-created');
        socket.emit('load old messages', messages);
        socket.on('new user', (data,cb) => {
            if(data in users){
                cb(false);
            }else{
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            }
        });
        //send a msg broadcasting
        socket.on('sent message', async (data, cb) => {

            let msg = data.trim();

            if(msg.substr(0, 3) === '/w '){
                msg = msg.substr(3);
                let index = msg.indexOf(' ');
                if(index !== -1){
                    let name = msg.substring(0, index);
                    let msg = msg.substring(index + 1);
                    if(name in users){
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    }else {
                        cb('Error! Please enter a valid user');
                    }
                }else {
                    cb('Error Please enter your message');
                }
            }else {
                let newM = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newM.save();

                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname

                });
                console.log('menssage save');
            }
        });
        socket.on('disconnect', data => {
           if(!socket.nickname) return;
           delete users[socket.nickname];
           updateNicknames();
        });
        const updateNicknames = () =>{
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
};