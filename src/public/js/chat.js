const socket = io()

let user
let chatbot = document.getElementById('chatbox')

Swal.fire({
    title: 'Identify',
    input: 'text',
    text: 'Enter your email for chat',
    //icon: 'success',
    inputValidator: value => {
        return !value && 'Your email is necessary to continue'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    socket.emit('authenticated', user)
})

const handleSocket = event => {
    if (event.key === 'Enter') {
        if (chatbot.value.trim().length > 0) {
            socket.emit('message', {
                user,
                message: chatbot.value
            })
            chatbot.value = ''
        }
    }
}

chatbot.addEventListener('keyup', handleSocket)

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    let messages = ''
    data.forEach(mess => {
        messages = messages + `<li>${mess.user} says: ${mess.message}</li><br>`
    })
    log.innerHTML = messages 
})

socket.on('newUserConnected', data => {
    if (!user) return
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false, 
        timer: 5000,
        title: `${data} has joined`,
        icon: 'success'
    })
})