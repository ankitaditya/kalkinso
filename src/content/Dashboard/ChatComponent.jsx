import React, { useState } from 'react';
import { TextInput, unstable__ChatButton as ChatButton, Button, Tile } from '@carbon/react';
import './ChatComponent.css'; // Import CSS for styling
import { Chat, Forum } from '@carbon/react/icons';
import { FluidForm } from 'carbon-components-react';
import FluidTextInput from '@carbon/react/lib/components/FluidTextInput';
import { UserAvatar } from '@carbon/ibm-products';

// MessageList Component
const MessageList = ({ messages }) => (
  <ul className="message-list">
    {messages.map((message, index) => (
      <MessageItem key={index} {...message} />
    ))}
  </ul>
);

// MessageItem Component
const MessageItem = ({ senderName, text, isBot }) => (
  <li className={`message-item ${isBot ? 'bot-message' : 'user-message'}`}>
    <span className='avatar'>|</span><span className='chat'>{text}</span>
  </li>
);

// UserInputForm Component
const UserInputForm = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSendMessage(input);
    setInput('');
  };

  return (
    <FluidForm onSubmit={handleSubmit} className="input-form">
        <FluidTextInput
            id="chat-input"
            labelText=""
            placeholder="Type something..."
            value={input}
            onChange={handleChange}
        />
        <Button kind='ghost' type="submit"><Forum size={20}/></Button>
    </FluidForm>
  );
};

// Main ChatComponent that puts everything together
const ChatComponent = () => {
  const [messages, setMessages] = useState([
    { senderName: 'Carbon Bot', text: 'Hello! How can I assist you today?', isBot: true },
    { senderName: 'User', text: 'I need help with my account.', isBot: false },
  ]);

  const handleSendMessage = (text) => {
    const newMessage = { senderName: 'User', text, isBot: false };
    setMessages([...messages, newMessage]);
  };

  return (
    <Tile className="chat-window">
      <MessageList messages={messages} />
      <UserInputForm onSendMessage={handleSendMessage} />
    </Tile>
  );
};

export default ChatComponent;
