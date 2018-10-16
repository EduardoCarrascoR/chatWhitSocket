$(function () {
    const socket = io();
    // obtaining Dom
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    // nickname form
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    const $users = $('#username');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else {
                $nickError.html(`
                    <div class="alert alert-danger">that user already exist<div/>
                `);

            }
            $nickname.val(' ');
        });
        console.log('enviando...');
    });
    //events
    $messageForm.submit(e =>{
        e.preventDefault();
        socket.emit('sent message', $messageBox.val(), data => {
        $chat.append(`<p class="error">${data}</p>`)
        });

        $messageBox.val(' ');
    });
    socket.on('new message', function (data) {
        $chat.append('<b>'+ data.nick + '</b> ' + data.msg + '<br/>');
    });
    socket.on('usernames', data => {
        let html = '';
        for(let i = 0; i < data.length; i++){
            html += `<p class="text"><i class="fas fa-user text"></i> ${data[i]}</p>`;
        }
        $users.html(html);
    });
    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);
    })
});