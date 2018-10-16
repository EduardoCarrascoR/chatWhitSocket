$(function () {
    //connect socket client
    const socket = io().connect();
    // obtaining Dom from Chat-element
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    // obtaining Dom form nickname
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else {
                $nickError.html(`<div class="alert alert-danger">that user already exist<div/>`);

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
    socket.on('new message', data => {
        displayMsg(data);
    });
    socket.on('usernames', data => {
        let html = '';
        for(let i = 0; i < data.length; i++){
            html += `<p class="text"><i class="fas fa-user text"></i> ${data[i]}</p>`;
        }
        $users.html(html);
    });
    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    });
    socket.on('load old messages', msg => {
        for(let i = msg.length -1; i >= 0; i--){
            displayMsg(msg[i]);
        }
    });
    const displayMsg = (data) => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);

    };
});