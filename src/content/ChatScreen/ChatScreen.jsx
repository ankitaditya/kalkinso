import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Tile,
  Grid,
  Row,
  Column
} from '@carbon/react';
import './ChatScreen.css';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
    { sender: "user", text: "I need some information about AI." }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { sender: "user", text: inputMessage }]);
      setInputMessage("");
      
      // Simulate a bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Sure, I can help with that." }
        ]);
      }, 1000);
    }
  };

  return (
    <Grid className="chat-screen">
      <Row className="chat-header">
        <Column>
          <h1>BucAI Chat</h1>
        </Column>
      </Row>
      <Row className="chat-body">
        <Column>
          {messages.map((message, index) => (
            <Tile
              key={index}
              className={`chat-message ${message.sender}`}
            >
              <p>{message.text}</p>
            </Tile>
          ))}
        </Column>
      </Row>
      <Row className="chat-input">
        <Column lg={10}>
          <TextInput
            id="message-input"
            labelText=""
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="chat-text-input"
          />
        </Column>
        <Column lg={2}>
          <Button className='chat-button' onClick={handleSendMessage}>Send</Button>
        </Column>
      </Row>
    </Grid>
  );
};

export default ChatScreen;