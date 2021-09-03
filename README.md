# scrawlio CISSA workshop
A Socket IO Workshop prototype. Definitely not a ~~scribblio~~ imitation. 

Complements the [workshop slideshow](https://docs.google.com/presentation/d/18UGjw9yFQcperLTtKUVapMumDTqiL0U4rXA8_gspJfU/edit?usp=sharing).
![image](https://user-images.githubusercontent.com/8501694/131948198-2fec18e4-e738-4c43-a83a-3965277db0e8.png)


## Familiar with React?
Checkout the React version of this workshop's code: https://github.com/jonjau/cissa-collaborative-whiteboard-prototype
Otherwise, you're in the right place!

## Downloading
If you're familiar with git, clone the repo: `git clone https://github.com/5Mixer/cissa-scrawlio.git`
Otherwise, you can download the code by clicking Code -> Download ZIP.

## Running
Ensure that [node](https://nodejs.org/en/download/) and npm are installed. Enter the folder in the terminal, install all dependencies with `npm i` and run the server with `npm start`. Open the application in your web browser by navigating to [`localhost:8000`](http://localhost:8000).

## Scaffolding explanation
`server.js` in the root directory is a node js script that hosts a server. We will edit it to facilitate communication between clients.

`public/client.js` is the client side script - this runs in the browser. We will so that it sends chat messages to the server, receives broadcasted chat messages from the server, and syncronises the whiteboard.

---

## Exercise One - Making Chat functional 💬 [Guided]
### 1. Send a message from the **client** to the server when a message has been submitted in the chat box.
```js
socket.emit('chat message', input.value);
```

### 2. Watch for new client connections on the **server**
```js
io.on('connection', (socket) => {
  console.log("New user!");
  // Setup event listeners with the new socket...
});
```

### 3. Receive chat messages on the **server** for this new connection
```js
socket.on('chat message', (msg) => {
  console.log("Received message " + msg);
});
```

### 4. Broadcast chat messages received by the **server** to all connected clients
```js
socket.on('chat message', (msg) => {
  io.emit('chat message', msg); // Broadcast to all clients the chat message
});
```
### 5. Make the **client** receive chat messages broadcast by the server
```js
socket.on('chat message', function(msg) {
	appendMessageToChatHistory(msg);
});
```
(Add this point, chat messages should work, but new users won't have the chat's history)

### 6. Adding chat history
Add a messages array to the server which stores all received messages. Add a 'chat history' event listener to the client which can add an array of messages to the UI. When a new client connects to the server, send them all stored messages via this 'chat history' event. 

---

## Exercise Two - Making the Whiteboard functional ✍️ [Workshopped]
### 1. Inform the server of when we draw a line
The objects `previousMousePosition` and `currentMousePosition` store the start and end of the line stroke. Socket IO lets you send any sort of message data, as we do here. (_*any sort you'll likely encounter - even byte data works!_)
```js
socket.emit('line', { from: previousMousePosition, to: currentMousePosition });
```

### 2. Broadcast the line messages received to clients
This will be very similar to how the server broadcasts chat messages to clients.

### 3. Receive lines on the client that the server has broadcast, and add it to our local whiteboard.
Again, just like adding chat messages, but this time we'll use the prepared `drawLine` method.

---

## Exercise Three - Adding ~~Scribblio~~ game functionality 🎮 [Extension]
 - Server pulls a random word out of a list
 - When a round starts, a new user is selected as the illustrator
 - The drawer is given permission to draw, everyone else is given permission to chat
 - Server watches for correct guesses in chat
