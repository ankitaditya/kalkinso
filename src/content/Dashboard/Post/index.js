// Post.js
import React, { useState } from 'react';
import {
  Button,
  Tile,
  TextInput,
  Grid,
  Column,
  IconButton,
  UnorderedList,
  ListItem,
} from '@carbon/react';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  ChartBar as BarChartIcon,
  FaceActivated as FaceSmileIcon,
  Calendar as CalendarIcon,
} from '@carbon/icons-react';
import '../Dashboard.scss';

const Post = ({ post, user }) => {
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <Tile className="shadow-0">
      <Grid>
        <Column sm={4} md={4} lg={4}>
          <img
            src={user?.image || "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"}
            className="rounded-circle"
            height="50"
            alt="KALKINSO Avatar"
            loading="lazy"
          />
        </Column>
        <Column sm={12} md={8} lg={8} className="d-flex align-items-center">
          <TextInput
            id="form1"
            className="form-status border-0 py-1 px-0"
            placeholder="What's happening"
            light
          />
        </Column>
      </Grid>
      <div className="d-flex justify-content-between">
        <Grid className="d-flex flex-row ps-3 pt-3" style={{ marginLeft: "50px" }}>
          <Column lg={1}>
            <IconButton label="Image" renderIcon={ImageIcon} />
          </Column>
          <Column lg={1}>
            <IconButton label="Video" renderIcon={VideoIcon} />
          </Column>
          <Column lg={1}>
            <IconButton label="Bar Chart" renderIcon={BarChartIcon} />
          </Column>
          <Column lg={1}>
            <IconButton label="Smile" renderIcon={FaceSmileIcon} />
          </Column>
          <Column lg={1}>
            <IconButton label="Calendar" renderIcon={CalendarIcon} />
          </Column>
        </Grid>
        <div className="d-flex align-items-center">
          <Button kind="primary" size="small" onClick={handleLike}>Post</Button>
        </div>
      </div>
    </Tile>
  );
};

export default Post;
