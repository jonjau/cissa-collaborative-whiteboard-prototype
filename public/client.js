// initialise socket.io
var socket = io();

// get html elements
var whiteboardElement = document.getElementById("whiteboard");
var messagesElement = document.getElementById("messages");
var formElement = document.getElementById("form");


// Handle sending a chat message from the UI
form.addEventListener('submit', function(e) {
	e.preventDefault();
	if (input.value) {
		socket.emit('chat message', input.value);
		input.value = '';
	}
});

// Socket io handle received messages
socket.on('chat message', function(msg) {
	var item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
	messagesElement.scrollTop = messagesElement.scrollHeight;
});