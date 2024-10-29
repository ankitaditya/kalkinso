import React from "react";

export const Button = ({ label, url, variant }) => {
  const bgColor = variant === "primary" ? "blue" : "gray";
  return (
    <a href={url} style={{ padding: "8px 16px", backgroundColor: bgColor, color: "#fff", textDecoration: "none" }}>
      {label}
    </a>
  );
};
