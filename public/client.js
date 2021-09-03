// initialise socket.io
var socket = io();

// get html elements
var whiteboardElement = document.getElementById("whiteboard");
var messagesElement = document.getElementById("messages");
var formElement = document.getElementById("form");


// get canvas context that can be used to draw on the element
var ctx = whiteboardElement.getContext('2d')
var mouseDown = false;
var previousMousePosition = { x: 0, y: 0 };
var currentMousePosition = { x: 0, y: 0 };
var brushRadius = 2;
var brushStyle = 'black';

whiteboardElement.addEventListener("mousemove", function (e) {
	updateMousePosition(e);
	if (mouseDown) {
		drawLine(previousMousePosition, currentMousePosition, brushRadius, brushStyle);
	}
}, false);
whiteboardElement.addEventListener("mousedown", function (e) {
	updateMousePosition(e);
	mouseDown = true;
}, false);
whiteboardElement.addEventListener("mouseup", function (e) {
	mouseDown = false;
}, false);
whiteboardElement.addEventListener("mouseout", function (e) {
	mouseDown = false;
}, false);

function drawLine(previousPosition, currentPosition, radius, style) {
	ctx.beginPath();
	ctx.moveTo(previousPosition.x, previousPosition.y);
	ctx.lineTo(currentPosition.x, currentPosition.y);
	ctx.strokeStyle = style;
	ctx.lineWidth = radius;
	ctx.stroke();
	ctx.closePath();
}
function updateMousePosition(e) {
	previousMousePosition = {
		x: currentMousePosition.x,
		y: currentMousePosition.y
	};
	currentMousePosition = {
		x: e.clientX - whiteboardElement.offsetLeft,
		y: e.clientY - whiteboardElement.offsetTop
	};
}

// Handle sending a chat message from the UI
form.addEventListener('submit', function(e) {
	e.preventDefault();
	if (input.value) {
		socket.emit('chat message', input.value);
		input.value = '';
	}
});

// Socket io handle received messages
function appendMessageToChatHistory(msg) {
	var item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
	messagesElement.scrollTop = messagesElement.scrollHeight;
}
socket.on('chat message', function(msg) {
	appendMessageToChatHistory(msg);
});
socket.on('chat history', function(msgHistory) {
	msgHistory.forEach(function (message, index) {
		appendMessageToChatHistory(message);
	})
});