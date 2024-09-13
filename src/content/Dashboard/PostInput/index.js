import React, { useState } from 'react';
import {
  TextArea,
  Button,
  ButtonSet,
  Tile,
} from '@carbon/react';
import {
  Attachment as AttachmentIcon,
  Link as LinkIcon,
  Checkmark as CheckmarkIcon,
} from '@carbon/icons-react';
import "./index.css";

const PostInput = () => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('A post was submitted: ' + value);
    setValue('');
  };

  const handleAttachment = () => {
    // Here you would handle the attachment logic
    alert('Attachment button clicked');
  };

  const handleLink = () => {
    // Here you would handle the link logic
    alert('Link button clicked');
  };

  return (
    <Tile className="post-input">
      <h3>New Post</h3>
      <form onSubmit={handleSubmit}>
        <TextArea
          value={value}
          onChange={handleChange}
          rows={5}
          id="post-textarea"
          placeholder="Write your post..."
          labelText=""
        />
        <ButtonSet className="editor-buttons">
          <Button
            hasIconOnly
            renderIcon={AttachmentIcon}
            iconDescription="Add Attachment"
            onClick={handleAttachment}
            kind="ghost"
          />
          <Button
            hasIconOnly
            renderIcon={LinkIcon}
            iconDescription="Add Link"
            onClick={handleLink}
            kind="ghost"
          />
          <Button
            renderIcon={CheckmarkIcon}
            iconDescription="Post"
            kind="primary"
            type="submit"
          >
            Post
          </Button>
        </ButtonSet>
      </form>
    </Tile>
  );
};

export default PostInput;
