import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log("Files dropped:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #10a37f",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        color: "#2c2c2c",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag & drop files here, or click to select files</p>
      )}
    </div>
  );
};

export default FileUpload;
