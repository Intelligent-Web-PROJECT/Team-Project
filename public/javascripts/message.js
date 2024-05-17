

document.addEventListener('DOMContentLoaded', init);


let socket = io()
let roomNo = null
let name = null

const newMessage = document.getElementById('new-message');
const chatInput = document.getElementById('chat_input');


function init() {
    console.log("Initializing socket...");

    socket.on('connect', function() {
        console.log('Connected to socket server');
    });

    socket.on('joined', function (room, userId) {
        console.log(userId + ' joined');
    });

    socket.on('chat', function (room, userId, chatText) {
        console.log('Received message:', chatText);
        writeNewMessage(chatText, userId);

    });
}

function connectToRoom() {
    document.getElementById('chat-container').style.display = 'block';
    var url = window.location.href;
    var parts = url.split("/");
    roomNo = parts[parts.length - 1];
    name = sessionStorage.getItem('nickName')
    socket.emit('create or join', roomNo, name);
    console.log('Attempting to join room:', roomNo, 'as', name);
}

function writeNewMessage(text, userId) {
    let messageContent = document.createElement('div');
    messageContent.className = userId === name ? 'chat-message user-message' : 'chat-message other-message'

    const userProfile = document.createElement('i')
    userProfile.className = 'fa-regular fa-user profile-icon'
    userProfile.style.fontSize = '20px'
    userProfile.style.marginRight = '5px'

    const content = document.createElement('div')
    content.className = 'message-content'

    const sender = document.createElement('p')
    sender.className = 'message-sender'
    sender.textContent = userId === name ? 'Me' : userId

    const message = document.createElement('p')
    message.className = 'message-text'
    message.textContent = text

    content.appendChild(sender)
    content.appendChild(message)

    messageContent.appendChild(userProfile)
    messageContent.appendChild(content)

    newMessage.appendChild(messageContent)

    chatInput.value = ''
    newMessage.scrollTop = newMessage.scrollHeight


}

function sendMessage() {
    console.log('inside send message')
    let chatText = chatInput.value
    if (chatText.trim() !== '') {
        let formData = new FormData()

        if (navigator.onLine) {
            socket.emit('chat',roomNo, name, chatText)
            formData.append('plant', roomNo)
            formData.append('nickname', name)
            formData.append('text', chatText)
            fetch('/addMessage', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network error")
                    }
                    return response.text()
                })
                .catch(error => {
                    console.log(error);
                });

        } else {
            let data = JSON.stringify({
                plant: roomNo,
                nickname: name,
                text: chatText
            });
            insertComment(data, -1);
            writeNewMessage(chatText, name);
        }

    }
}