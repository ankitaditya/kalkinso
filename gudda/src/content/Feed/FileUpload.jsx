import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = ({input, setImageInput}) => {
  const onDrop = useCallback((acceptedFiles) => {
    setImageInput(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps, fileRejections, acceptedFiles, isDragActive } = useDropzone({ onDrop, accept: {"image/*":[]} });

  return (
    <>
    {acceptedFiles.length===0&&<div
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
    </div>}
    {acceptedFiles.length>0&&<div>
            {
                acceptedFiles.map((file) => {
                    return (
                            <>
                            {input}
                            <img key={file.name} src={URL.createObjectURL(file)} alt={file.name} style={{margin:"10px", maxHeight:"100px"}} />
                            </>
                    )
                })
            }
        </div>}
    </>
  );
};

export default FileUpload;
