$(document).ready(function() {
    localStorage.setItem('groupId', null)
    const chatSocket = io('https://study-group-socket-cluster.herokuapp.com/chat')
    chatSocket.on('outputChatMessage', chat => {
        let message
        console.log(chat)
        let sender = chat.sender == localStorage.getItem('username') ? $('<h5></h5>').text('Me') : $('<h5></h5>').text(chat.sender);
        if(chat.type == 'text') {
            message = $('<p></p>').text(chat.message);
            $('#messages').append($('<li>').addClass('message').append(sender, message));
        } else {
            let files = JSON.parse(chat.message)
            console.log(files)
            for (let file of files) {
                if(file.type == 'image') {
                    console.log('image')
                    message = $('<img></img>').attr('src', file.fileURL);
                } else if(file.type == 'video') {
                    message = $('<video></video>').attr({'autoplay': '','controls': ''} ).append($('<source></source>').attr({'src': file.fileURL, 'type': 'video/mp4'}));
                } else {
                    message = $('<a></a>').attr({'href': file.fileURL, 'download': ''});
                }
                $('#messages').append($('<li>').addClass('message').append(sender, message));

            }
        }
        
    })
    localStorage.setItem('groupId', $('.my-group').val());
    $('.my-group').on('change', function(e) {
        localStorage.setItem('groupId', $('.my-group').val());
        chatSocket.emit('join chat room', e.currentTarget.value);
        $('#messages').empty()
        getMessage()
    })
    $('#create-group').click(function() {
        let name = $('#group-name').val()
        let grade = $('#class').val()
        axios.post('https://study-group-group.herokuapp.com/group', {
            name,
            class: grade,
        }, {
            params: {
                username: localStorage.getItem('username'),
                token: localStorage.getItem('token')
            }
        })
        .then(() => {
            getGroups()
        });
    })
    function getGroups() {
        axios.get('https://study-group-user.herokuapp.com/users',{
            params: {
                username: localStorage.getItem('username'),
                token: localStorage.getItem('token')
            }
        })
        .then(response => response.data)
        .then(async function (userStatus)  {
            console.log(userStatus)
            if(userStatus.inGroups.length > 0) {
                for(let i = 0; i < userStatus.inGroups.length; i++) {
                    let response = await axios.get('https://study-group-group.herokuapp.com/group', {
                        params: {
                            username: localStorage.getItem('username'),
                            token: localStorage.getItem('token'),
                            groupId: userStatus.inGroups[i]
                        }
                    })
                    let group = response.data
                    $('.my-group').append($('<option></option>').val(`${group._id}`).text(`${group.name}`));
                }
            }
        })
    }

    getGroups()

    function getMessage() {
        axios.get('https://study-group-chat.herokuapp.com/chat',{
            params: {
                username: localStorage.getItem('username'),
                token: localStorage.getItem('token'),
                groupId: localStorage.getItem('groupId')
            }
        })
        .then(response => response.data)
        .then(chats => {
            if(chats.length > 0) {
                let message
                for (let chat of chats) {
                    let sender = chat.sender == localStorage.getItem('username') ? $('<h5></h5>').text('Me') : $('<h5></h5>').text(chat.sender);
                    if(chat.type == 'text') {
                        message = $('<p></p>').text(chat.message);
                        $('#messages').append($('<li>').addClass('message').append(sender, message));
                    } else {
                        console.log(chat.message)
                        let files = JSON.parse(chat.message)
                        console.log(files)
                        for (let file of files) {
                            if(file.type == 'image') {
                                console.log('image')
                                message = $('<img></img>').attr('src', file.fileURL);
                            } else if(file.type == 'video') {
                                message = $('<video></video>').attr({'autoplay': '','controls': ''} ).append($('<source></source>').attr({'src': file.fileURL, 'type': 'video/mp4'}));
                            } else {
                                message = $('<a></a>').attr({'href': file.fileURL, 'download': ''})
                            }
                            $('#messages').append($('<li>').addClass('message').append(sender, message));
            
                        }
                    }
                }
            } else {
                $('#messages').append($('<li>').text('No message'))
            }
        })
    }

    $('.send-message').click(function() {
        let message = $('#input-message').val()
        let sender = localStorage.getItem('username')
        let type = 'text'
        let time = new Date
        time = time.toString()
        console.log(time)
        chatSocket.emit('inputChatMessage', {
            message,
            sender,
            type,
            time,
            groupId: localStorage.getItem('groupId')
        })
    })

    $('.files').on('change', function(e) {
        let files = e.currentTarget.files
        console.log(e)
        console.log(files)
        let formData = new FormData()
        for(let file of files) {
            formData.append("files", file);
        }
        formData.append('groupId', localStorage.getItem('groupId'))
        formData.append('username', localStorage.getItem('username'))
        axios.post('http://localhost:3010/upload/messages', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => response.data)
        .then((files) => {
            console.log(files)
            let message = JSON.stringify(files)
            let sender = localStorage.getItem('username')
            let type = 'files'
            chatSocket.emit('inputChatMessage', {
                message,
                sender,
                type,
                groupId: localStorage.getItem('groupId')
            })
        })
    })
})