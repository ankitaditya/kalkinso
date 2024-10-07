import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Menu } from "@mantine/core";
import { MdVideoLibrary } from "react-icons/md";
import "./styles.css";

// The YouTube block.
export const YouTubeBlock = createReactBlockSpec(
  {
    type: "youtube",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      videoId: {
        default: "",
        values: [],
      },
    },
    content: "block", // Full block content
  },
  {
    render: (props) => {
      const videoId = props.block.props.videoId;

      return (
        <div className={"youtube-block"} data-video-id={videoId}>
          {/* YouTube Icon which opens a menu to choose the video URL */}
          <Menu withinPortal={false} zIndex={999999}>
            <Menu.Target>
              <div className={"youtube-icon-wrapper"} contentEditable={false}>
                <MdVideoLibrary
                  className={"youtube-icon"}
                  size={32}
                />
              </div>
            </Menu.Target>
            {/* Dropdown to input the YouTube video ID */}
            <Menu.Dropdown>
              <Menu.Label>Embed YouTube Video</Menu.Label>
              <Menu.Divider />
              <Menu.Item>
                <input
                  type="text"
                  placeholder="Enter YouTube Video ID"
                  defaultValue={videoId}
                  onBlur={(e) =>
                    props.editor.updateBlock(props.block, {
                      type: "youtube",
                      props: { videoId: e.target.value },
                    })
                  }
                />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          {/* YouTube Video Embed */}
          {videoId && (
            <LiteYouTubeEmbed
              id={videoId}
              title="YouTube Video"
            />
          )}
          {/* Rich text field for user to type in (optional) */}
          <div className={"inline-content"} ref={props.contentRef} />
        </div>
      );
    },
  }
);