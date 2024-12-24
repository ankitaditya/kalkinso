import React from "react";
import VideoPlayer from "./VideoPlayer";
// import ThreeDBackground from "./ThreeDBackground";
import "./Live.scss";

function Live() {
  return (
    <VideoPlayer url={`https://live.kalkinso.org/live/721WGd8tKQad5YAibSlms0TCD7u8KbGD.flv`} type={'flv'} />
  );
}

export default Live;
