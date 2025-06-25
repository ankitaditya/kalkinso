import React, { useEffect, useRef } from "react";
import flv from 'flv.js';
import Search from "../Search";
import { Button, Theme } from "@carbon/react";
import { Close, IbmWatsonDiscovery } from "@carbon/react/icons/index";

const VideoPlayer = ({ url, type }) => {
  const playerRef = useRef(null);
  const [search, setSearch] = React.useState(false);
  const [component, setComponent] = React.useState(null);
  const buildPlayer = () => {
    const player = flv.createPlayer({
      type,
      url,
    });
    player.attachMediaElement(playerRef.current);
    player.load();
  }

  useEffect(() => {
    buildPlayer();
  }, [playerRef]);  

  return (
    <Theme theme="g100">
    <div className="video-player-container">
            <Button style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 10000000,
                color: 'white',
            }} kind="ghost" onClick={()=>{
                if(search) {
                    setSearch(false);
                    setComponent(null);
                } else {
                    setSearch(true);
                    setComponent(<Search />);
                }
            }}>
                {search?<Close />:<IbmWatsonDiscovery />}
            </Button>
        {component}
        <video
            ref={playerRef}
            width="100%"
            height="100%"
            controls={true}
            autoPlay={true}
            />
    </div>
    </Theme>
  );
};

export default VideoPlayer;
