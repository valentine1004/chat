const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('input-message');
const chatElem = document.getElementById('chat');
const messagesList = document.getElementById('messages-list');

let messages = [];
let ws = new WebSocket('ws://localhost:4000');


function createElem(text) {
    var newElem = document.createElement("div");
    newElem.className = 'message-wrapper';
    newElem.innerHTML = `<span class="message">${text}</span>`;
    messagesList.appendChild(newElem);
}

ws.onmessage = function (event) {
    console.log(event);
    createElem(event.data);
}

sendBtn.addEventListener('click', () => {
    messages.push(messageInput.value);
    ws.send(messageInput.value);
    messageInput.value = '';
});
