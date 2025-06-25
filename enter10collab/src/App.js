import React, { useRef, useEffect, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { TextInput, Button, InlineLoading, Tile, FileUploader } from "@carbon/react";
import "./App.css";

const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }
  return <video ref={videoRef} autoPlay muted controls className="video-preview" />;
};

const ReelMaker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [karaokeFile, setKaraokeFile] = useState(null);
  const [karaokeType, setKaraokeType] = useState(null);
  
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      alert(`Searching for: ${searchQuery}`);
      setLoading(false);
    }, 1000);
  };

  const handleKaraokeUpload = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setKaraokeFile(URL.createObjectURL(file));
      setKaraokeType(file.type.startsWith("video") ? "video" : "audio");
    }
  };
  
  return (
    <Tile className="reel-container">
      <h2>🎬 Entertain Collab</h2>
      <div className="search-bar">
        <TextInput
          id="search-input"
          labelText="Search Reels"
          placeholder="Search Reels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <Button kind="secondary" onClick={handleSearch} className="search-button">
          {loading ? <InlineLoading description="Searching..." /> : "🔍 Search"}
        </Button>
      </div>
      
      <FileUploader
        labelTitle="Upload Karaoke (Audio or Video)"
        labelDescription="Supported formats: MP3, MP4, AVI, WEBM"
        buttonLabel="Upload"
        accept={[".mp3", ".mp4", ".avi", ".webm"]}
        onChange={handleKaraokeUpload}
      />

      {karaokeFile && (
        <div className="karaoke-preview">
          {karaokeType === "video" ? (
            <video src={karaokeFile} autoPlay loop muted className="karaoke-video"  />
          ) : (
            <audio src={karaokeFile} autoPlay loop controls className="karaoke-audio" />
          )}
        </div>
      )}
      
      <ReactMediaRecorder
        video
        render={({ status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl, previewStream }) => (
          <div>
            <p className="status-text">{status}</p>
            {mediaBlobUrl ? (
              <video src={mediaBlobUrl} controls autoPlay loop className="video-preview" />
            ) : (
              <VideoPreview stream={previewStream} />
            )}
            <div className="button-group">
              <Button kind="primary" onClick={() => { clearBlobUrl(); startRecording(); }} className="start-button">
                🎥 Start Recording
              </Button>
              <Button kind="danger" onClick={stopRecording} className="stop-button">
                ⏹ Stop Recording
              </Button>
            </div>
            {mediaBlobUrl && (
              <Button kind="tertiary" href={mediaBlobUrl} download="reel.webm" className="download-button">
                📥 Download Reel
              </Button>
            )}
            <div className="button-group">
              <Button kind="tertiary" className="publish-button">🚀 Publish</Button>
              <Button kind="ghost" className="collab-button">🤝 Ask for Collab</Button>
            </div>
            <h3 className="coming-soon">🎞️ Editing Features (Coming Soon)</h3>
            <p className="feature-list">✂️ Trim | 🎨 Filters | 🎶 Add Music | 🔤 Add Text</p>
          </div>
        )}
      />
    </Tile>
  );
};

export default ReelMaker;
