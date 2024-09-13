// Comments.js
import React, { useState } from 'react';
import {
  TextArea,
  Button,
  Tile,
  Grid,
  Column,
} from '@carbon/react';
import './Comments.css';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    setComments([...comments, { content: newComment }]);
    setNewComment('');
  };

  return (
    <div className="comments">
      {comments.map((comment, index) => (
        <Tile key={index} className="comment">
          <p>{comment.content}</p>
          <Grid>
            <Column>
              <Button kind="secondary" size="small">Reply</Button>
            </Column>
            <Column>
              <Button kind="tertiary" size="small">Like</Button>
            </Column>
          </Grid>
        </Tile>
      ))}
      <TextArea
        labelText=""
        value={newComment}
        onChange={handleCommentChange}
        rows={3}
        id="comment-input"
        placeholder="Write a comment..."
      />
      <Button kind="primary" onClick={handleCommentSubmit}>Add Comment</Button>
    </div>
  );
};

export default Comments;
