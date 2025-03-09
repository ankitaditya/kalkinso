import React, { useState } from "react";
import {
  Button,
  TextArea,
  Tile,
  InlineNotification,
  ClickableTile,
} from "@carbon/react";
import { Send } from "@carbon/icons-react";
import { Column, Grid } from "carbon-components-react";

import "./Build.scss"; // <-- SCSS styles

const suggestionPrompts = [
  "I have a business idea I'd like to explore",
  "Help me start a new business",
  "I want to learn more about Kalkinso's services",
  "Can you help me with AI implementation?",
  "I need assistance with project planning",
  "Show me how to use Kalkinso's tools",
];

const Build = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm here to help you build and implement your ideas. What would you like to create today?",
    },
  ]);

  const [history, setHistory] = useState([
    {
      role: "23rd July 2021",
      active: true,
      content:
        "Hello! I'm here to help you build and implement your ideas. What would you like to create today?",
    },
    {
      role: "23rd July 2021",
      active: false,
      content:
        "I'm working on implementing the AI response functionality. For now, this is a placeholder response.",
    },
    {
      role: "23rd July 2021",
      active: false,
      content:
        "I'm working on implementing the AI response functionality. For now, this is a placeholder response.",
    },
    {
      role: "23rd July 2021",
      active: false,
      content:
        "I'm working on implementing the AI response functionality. For now, this is a placeholder response.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response with a timeout
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm working on implementing the AI response functionality. For now, this is a placeholder response.",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleHistoryClick = (index) => {
    setHistory((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, active: true } : { ...msg, active: false }
      )
    );
  };

  return (
    <Grid>
      {/* Left column: history list */}
      <Column lg={4} md={2} sm={4} className="left-column">
        <div className="history-container">
          {history.map((message, index) => (
            <ClickableTile
              key={index}
              onClick={() => handleHistoryClick(index)}
              className={message.active ? "active-tile" : ""}
            >
              <strong>{message.role}</strong>
              <p>
                {message.content.length > 20
                  ? `${message.content.slice(0, 20)}...`
                  : message.content}
              </p>
            </ClickableTile>
          ))}
        </div>
      </Column>

      {/* Right column: chat area */}
      <Column lg={12} md={6} sm={4} className="chat-column">
        <div className="messages-container">
          {messages.map((message, index) => (
            <Tile
              key={index}
              className={
                message.role === "assistant" ? "assistant-tile" : "user-tile"
              }
            >
              <strong>
                {message.role === "assistant" ? "Kalkinso AI" : "You"}
              </strong>
              <p>{message.content}</p>
            </Tile>
          ))}
          {isLoading && (
            <InlineNotification
              kind="info"
              title="Kalkinso AI is typing..."
              lowContrast
            />
          )}
        </div>

        {/* Suggestions */}
        <div className="suggestions-container">
          <p>Suggestions:</p>
          <div className="suggestion-buttons">
            {suggestionPrompts.map((prompt, index) => (
              <Button
                key={index}
                size="small"
                kind="secondary"
                onClick={() => setInput(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="input-form-container">
          <div className="input-wrapper">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              rows={3}
              disabled={isLoading}
            />
            <Button
              type="submit"
              renderIcon={Send}
              disabled={isLoading || !input.trim()}
            >
              Send
            </Button>
          </div>
        </form>
      </Column>
    </Grid>
  );
};

export default Build;
