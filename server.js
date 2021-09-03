const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('react-client/build'))

let messages = [];

io.on('connection', (socket) => {
	console.log("New user.");
	socket.emit('chat history', messages);
	socket.on('chat message', (msg) => {
		io.emit('chat message', msg); // Broadcast to all clients the chat message
		messages.push(msg);
	});
	socket.on('line', (lineData) => {
		io.emit('line', lineData); // Broadcast to all clients the line data
	});
});

server.listen(8000, () => {
	console.log('listening on *:8000');
});