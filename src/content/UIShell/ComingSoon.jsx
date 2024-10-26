import { Send } from '@carbon/react/icons';
import React, { useState } from 'react';
// import { TextInput, Button } from '@carbon/react';
import { Button, Input, MessageList } from 'react-chat-elements';
import "react-chat-elements/dist/main.css"


const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ width: '50vw', margin: '20px', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: 'white' }}>
      
      <MessageList
          className='message-list'
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={[
          {
            position:"left",
            type:"text",
            title:"Kursat",
            text:"Give me a message list example !",
          },
          {
            position:"right",
            type:"text",
            title:"Emre",
            text:"That's all.",
          },
          ]}
      />
      <Input
            placeholder="Type here..."
            multiline={true}
            />
      <Button
            text={"Send"}
            onClick={() => alert("Sending...")}
            type='primary'
            title="Send"
            icon ={{
                float:'left',
                size:15,
                component:<Send />
            }}/>
      </div>
  );
};

export default ChatComponent;
