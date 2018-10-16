const mongo = require('mongoose');
const {Schema} = mongo;

const chat = new Schema({
    nick: String,
    msg: String,
    crated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongo.model('Chat', chat);