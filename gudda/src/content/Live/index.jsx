import React from "react";
import VideoPlayer from "./VideoPlayer";
// import ThreeDBackground from "./ThreeDBackground";
import "./Live.scss";

function Live() {
  return (
    // <VideoPlayer url={`https://live.kalkinso.org/live/721WGd8tKQad5YAibSlms0TCD7u8KbGD.flv`} type={'flv'} />
    <VideoPlayer url={`rtsp://129.168.19.210:554/ch01.264`} type={'flv'} />
  );
}

export default Live;
