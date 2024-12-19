import React, { useEffect, useRef } from "react";
import flv from 'flv.js';

const VideoPlayer = ({ url }) => {
  const playerRef = useRef(null);
  const buildPlayer = () => {
    const player = flv.createPlayer({
      type: 'flv',
      url: `https://live.kalkinso.org/live/721WGd8tKQad5YAibSlms0TCD7u8KbGD.flv`,
    });
    player.attachMediaElement(playerRef.current);
    player.load();
  }

  useEffect(() => {
    buildPlayer();
  }, [playerRef]);

  return (
    <div className="video-player-container">
      <video
        ref={playerRef}
        width="100%"
        height="100%"
        controls={true}
        autoPlay={true}
      />
    </div>
  );
};

export default VideoPlayer;
