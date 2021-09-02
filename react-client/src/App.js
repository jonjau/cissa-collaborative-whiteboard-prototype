import React, { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const Board = ({socket}) => {
  // references to DOM elements to directly access them in a React component
  const whiteboardRef = useRef(null);
  const inputRef = useRef(null);

  // state variables for convenience to refer to DOM elements
  const [whiteboard, setWhiteboard] = useState(null);
  const [input, setInput] = useState(null);

  const [messages, setMessages] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState(
    { x: 0, y: 0}
  );
  const [currentMousePosition, setCurrentMousePosition] = useState(
    { x: 0, y: 0}
  );
  const [brushRadius, setBrushRadius] = useState(2);
  const [brushStyle, setBrushStyle] = useState('black');

  // empty dependency array (2nd arg) means this will be run once, when
  // component is "mounted"
  useEffect(() => {
    // set DOM elements pointed to as variables for convenience
    setWhiteboard(whiteboardRef.current);
    setInput(inputRef.current);
    
    // set up socket listeners
    socket.on('line', (lineData) => {
      drawLine(lineData.from, lineData.to, brushRadius, brushStyle);
    });
    socket.on('chat message', (msg) => {
      appendMessageToChatHistory(msg);
    });
    socket.on('chat history', (msgHistory) => {
      msgHistory.forEach((message, index) => {
        appendMessageToChatHistory(message);
      })
    });
  }, []);
  
  const appendMessageToChatHistory = (msg) => {
    setMessages([...messages, msg]);
  }

  const drawLine = (previousPosition, currentPosition, radius, style) => {
    // get canvas context that can be used to draw on the element
    const ctx = whiteboardRef.current.getContext('2d')
    ctx.beginPath();
    ctx.moveTo(previousPosition.x, previousPosition.y);
    ctx.lineTo(currentPosition.x, currentPosition.y);
    ctx.strokeStyle = style;
    ctx.lineWidth = radius;
    ctx.stroke();
    ctx.closePath();
  };

  const updateMousePosition = (e) => {
    setPreviousMousePosition({
      x: currentMousePosition.x,
      y: currentMousePosition.y
    });
    setCurrentMousePosition({
      x: e.clientX - whiteboard.offsetLeft,
      y: e.clientY - whiteboard.offsetTop
    });
  }

  const onMouseMove = (e) => {
    updateMousePosition(e);
    if (mouseDown) {
      drawLine(
        previousMousePosition,
        currentMousePosition,
        brushRadius,
        brushStyle
      );
      socket.emit('line', {
        from: previousMousePosition,
        to: currentMousePosition
      });
    } 
  }

  const onMouseDown = (e) => {
    updateMousePosition(e);
    setMouseDown(true)
  }

  const onMouseUp = (e) => {
    setMouseDown(false);
  }

  const onMouseOut = (e) => {
    setMouseDown(false);
  }

  // Handle sending a chat message from the UI
  const onSubmitForm = (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  }

  return (
    <>
      <canvas
        id="whiteboard"
        width="500"
        height="500"
        ref={whiteboardRef}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseOut}
      ></canvas>
      <ul id="messages">
        {messages.map((msg) => <li>{msg}</li>)}
      </ul>
      <form id="form" action="" onSubmit={onSubmitForm}>
        <input id="input" autoComplete="off" ref={inputRef}/>
        <button>Send</button>
      </form>
    </>
  );
}

const App = () => {
  // supply socket initialised a component "one level above" the Board
  // component, to avoid multiple initialisations
  const socket = io();

  return (
    <Board socket={socket} />
  );
};

export default App;
