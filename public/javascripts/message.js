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
    name = document.getElementById('username').textContent;
    socket.emit('create or join', roomNo, name);
    console.log('Attempting to join room:', roomNo, 'as', name);
}

function writeNewMessage(text, userId) {
    let message = document.createElement('p');
    message.textContent = text;
    message.className = 'chat-message user-message';
    newMessage.appendChild(message);

    chatInput.value = '';
    newMessage.scrollTop = newMessage.scrollHeight;
}

function sendMessage() {
    let chatText = chatInput.value
    if (chatText.trim() !== '') {
        socket.emit('chat',roomNo, name, chatText)
    }
}