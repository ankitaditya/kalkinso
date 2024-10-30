import React, { useState } from "react";
import { Puck } from "@measured/puck";
import { Heading, Text, Button } from "./components"; // Custom components
import "@measured/puck/puck.css";
import "./PuckEditor.css";
 
// Create Puck component config
const config = {
  components: {
    HeadingBlock: {
      fields: {
        children: {
          type: "text",
        },
      },
      render: ({ children }) => {
        return <h1 style={{
          textAlign: 'center',
          padding: '10px',
          margin: '10px',
        }}>{children}</h1>;
      },
      defaultProps: {
        children: "Kalkinso",
      },
    },
  },
};
 
// Describe the initial data
const initialData = {
  "content": [
    {
      "type": "HeadingBlock",
      "props": {
        "id": "HeadingBlock-1234",
        "title": "Hello, world"
      }
    }
  ],
  "root": { "props": { "title": "Puck Example" } },
  "zones": {}
};
 
// Save the data to your database
const save = (data) => {};
 
// Render Puck editor
const Editor = () => {
  return <Puck config={config} data={initialData} onPublish={save} />;
}

export default Editor;