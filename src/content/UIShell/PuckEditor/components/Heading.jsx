import React from "react";

export const Heading = ({ text, size, align }) => {
  const fontSize = size === "large" ? "2em" : size === "medium" ? "1.5em" : "1em";
  return <h1 style={{ textAlign: align, fontSize }}>{text}</h1>;
};
