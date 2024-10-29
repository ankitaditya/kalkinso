import React, { useState } from "react";
import { Puck } from "@measured/puck";
import { Heading, Text, Button } from "./components"; // Custom components
import "@measured/puck/puck.css";


// Define configurations for each component in the editor
const componentConfigs = {
  components:{
    heading: {
      label: "Heading",
      fields: {
        text: { type: "textarea", default: "Heading Text" },
        size: {
          type: "select",
          options: ["small", "medium", "large"],
          default: "medium",
        },
        align: {
          type: "radio",
          options: ["left", "center", "right"],
          default: "left",
        },
      },
      render: ({ text, size, align }) => (
        <Heading text={text} size={size} align={align} />
      ),
    },
    text: {
      label: "Text",
      fields: {
        text: { type: "textarea", default: "Some text content" },
        size: {
          type: "select",
          options: ["small", "medium", "large"],
          default: "medium",
        },
        color: {
          type: "select",
          options: ["default", "muted"],
          default: "default",
        },
      },
      render: ({ text, size, color }) => <Text text={text} size={size} color={color} />,
    },
    button: {
      label: "Button",
      fields: {
        label: { type: "text", default: "Click Me" },
        url: { type: "text", default: "#" },
        variant: {
          type: "select",
          options: ["primary", "secondary"],
          default: "primary",
        },
      },
      render: ({ label, url, variant }) => <Button label={label} url={url} variant={variant} />,
    },
  }
};

// Sample data for the page content
const samplePageData = {
  content: [
    { type: "heading", props: { text: "Welcome to Puck Editor!", size: "large", align: "center" } },
    { type: "text", props: { text: "This is a sample text component.", size: "medium", color: "default" } },
    { type: "button", props: { label: "Get Started", url: "#", variant: "primary" } },
  ],
  root: { "props": { "title": "Puck Example" } },
  zones: {}
};

const Editor = () => {
  const [pageData, setPageData] = useState(samplePageData);

  const handlePageDataChange = (newData) => {
    setPageData(newData);
  };

  return (
    <div style={{marginTop: "3rem"}}>
      <Puck
        data={pageData}
        onPublish={handlePageDataChange}
        config={componentConfigs}
      />
    </div>
  );
};

export default Editor;
