import React from "react";

export const Text = ({ text, size, color }) => {
  const fontSize = size === "large" ? "1.2em" : size === "medium" ? "1em" : "0.8em";
  const textColor = color === "muted" ? "#666" : "#000";
  return <p style={{ fontSize, color: textColor }}>{text}</p>;
};
