import React, { useState } from "react";
import { Puck, Render } from "@measured/puck";
import { Heading, Text, Button } from "./components"; // Custom components
import "@measured/puck/puck.css";
import "./PuckEditor.css";
 
// Create Puck component config
const config = {
  components: {
    HeadingBlock: {
      fields: {
        id: {
          type: "text",
        },
        children: {
          type: "text",
        },
      },
      render: ({ id,children }) => {
        return <h1 
        id={id}
        style={{
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
  root: {
    render: ({ children, title, puck }) => {
      return <>
      <h1 
        style={{
          textAlign: 'center',
          padding: '10px',
          margin: '10px',
        }}>{title}</h1>
      {children}
      </>;
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
              "children": "Hello, world"
          }
      },
      {
          "type": "HeadingBlock",
          "props": {
              "children": "Kalkinso",
              "id": "HeadingBlock-e6861f1f-df5d-4726-89e9-2e230748691b"
          }
      }
  ],
  "root": {
      "props": {
          "title": "Kalkinso"
      }
  },
  "zones": {}
};
 
// Save the data to your database
const save = (data) => {
  console.log(data);
  // Save the data to your database
};
 
// Render Puck editor
const Editor = () => {
  // return <Render config={config} data={initialData} />;
  return <Puck config={config} data={initialData} onPublish={save} />;
}

export default Editor;