const chatNotifySocket = io('http://localhost:3012/notifyChat')
chatNotifySocket.emit('join chat notify groups', {username: localStorage.getItem('username'), token: localStorage.getItem('token')})
chatNotifySocket.on('newMessage', (res) => {
    console.log(res)
})