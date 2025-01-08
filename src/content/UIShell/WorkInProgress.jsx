import React from "react";
import { ProgressBar, InlineLoading, Button } from "@carbon/react";
import { WarningAlt } from "@carbon/icons-react";

const WorkInProgress = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        gap: "1rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        maxWidth: "400px",
        margin: "auto",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h3 style={{ margin: 0 }}>Work in Progress</h3>
      <p style={{ textAlign: "center", color: "#6f6f6f", fontSize: "0.875rem" }}>
        We're currently working on this feature. Stay tuned for updates!
      </p>

      {/* Progress Bar */}
      <ProgressBar
        label="Progress"
        helperText="Feature development in progress..."
        value={45} // Update value as needed (0-100)
        max={100}
      />

      {/* Inline Loading */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <InlineLoading
          description="Loading updates..."
          status="active" // Can be "active", "finished", or "error"
        />
        <span style={{ color: "#6f6f6f" }}>Please wait...</span>
      </div>

      {/* Warning Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#ff832b",
        }}
      >
        <WarningAlt size={24} />
        <span>Some features may be incomplete.</span>
      </div>

      {/* Action Button */}
      <Button
        kind="secondary"
        onClick={() => alert("Thank you for your patience!")}
      >
        Learn More
      </Button>
    </div>
  );
};

export default WorkInProgress;
