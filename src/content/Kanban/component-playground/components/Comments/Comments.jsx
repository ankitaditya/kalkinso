// FeedPage.js
import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Comment, 
    Form, 
    Button, 
    Input, 
    Icon, 
    Image, 
    CommentAvatar, 
    CommentAuthor, 
    CommentMetadata, 
    CommentText, 
    CommentActions, 
    CommentAction,
    CommentContent,
    CommentGroup, 
    FormTextArea,
    ButtonOr,
    ButtonGroup } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { useSelector } from 'react-redux';
import { v4 as uuid4 } from 'uuid';

const CommentPage = ({data, setData}) => {
    const [newComment, setNewComment] = useState('');
    const [newReply, setNewReply] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const { user }  = useSelector((state) => state.auth);

    useEffect(() => {
        console.log('comments: ', data);
    }, [data]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleReplyChange = (e) => {
        setNewReply(e.target.value);
    };

    const handleAttachmentChange = (e) => {
        console.log('attachment: ', e.target.files[0]);
        setAttachment(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        if (newComment || newReply) {
            const newEntry = newComment ?{
                user_id: user?._id, 
                comment_id: uuid4(),
                text: newComment,
                attachment: attachment ? URL.createObjectURL(attachment) : null,
                timestamp: new Date().toLocaleString(),
                likes: 0,
                replies: []
            }: {
                user_id: user?._id, 
                comment_id: uuid4(),
                text: newReply,
                attachment: attachment ? URL.createObjectURL(attachment) : null,
                timestamp: new Date().toLocaleString(),
                likes: 0,
                replies: []
            };

            if (replyingTo !== null) {
                const updatedComments = [...data];
                updatedComments[replyingTo.index].replies.push(newEntry);
                setData(updatedComments);
                setReplyingTo(null);
            } else {
                setData([newEntry, ...data]);
            }

            setNewComment('');
            setAttachment(null);
        }
    };

    const handleLike = (index, parentIndex = null) => {
        const updatedComments = [...data];
        if (parentIndex !== null) {
            updatedComments[parentIndex].replies[index].likes += 1;
        } else {
            updatedComments[index].likes += 1;
        }
        setData(updatedComments);
    };

    const handleDelete = (index, parentIndex = null) => {
        if (parentIndex !== null) {
            const updatedComments = [...data];
            updatedComments[parentIndex].replies = updatedComments[parentIndex].replies.filter(
                (_, i) => i !== index
            );
            setData(updatedComments);
        } else {
            setData(data.filter((_, i) => i !== index));
        }
    };

    const handleEdit = (index, parentIndex = null) => {
        if (parentIndex !== null) {
            const commentToEdit = data[parentIndex].replies[index];
            setNewComment(commentToEdit.text);
            handleDelete(index, parentIndex);
        } else {
            const commentToEdit = data[index];
            setNewComment(commentToEdit.text);
            handleDelete(index);
        }
    };

    const handleReply = (index) => {
        setReplyingTo(index);
        setNewReply('');
    };

    const AttachmentThumbNail = ({attachment}) => {
        console.log('attachment: ', attachment.blob);
        if (attachment.endsWith('.jpg') || attachment.endsWith('.png') || attachment.endsWith('.jpeg')) {
            return <Image src={attachment} style={{ margin: '10px' }} />;
        } else {
            return (
                <img src="https://via.placeholder.com/100?text=File" style={{ margin: '10px' }} />
            );
        }
    };

    const renderComments = (commentsList, parentIndex = null) => {
        return commentsList.map((comment, index) => (
            <Comment key={index} style={{marginBottom: "10px", marginTop: "10px"}}>
                <CommentContent>
                    <CommentAvatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                    <CommentAuthor as="a">User</CommentAuthor>
                    <CommentMetadata>
                        <div>{comment.timestamp}</div>
                    </CommentMetadata>
                    <CommentText>{comment.text}</CommentText>
                    {comment.attachment && (
                        <AttachmentThumbNail attachment={comment.attachment} />
                    )}
                    <CommentActions>
                        <CommentAction onClick={() => handleLike(index, parentIndex)}>
                            <Icon name="thumbs up" /> {comment.likes} Likes
                        </CommentAction>
                        <CommentAction onClick={() => handleReply({index,id:comment.comment_id})}>
                            <Icon name="reply" /> Reply
                        </CommentAction>
                        <CommentAction onClick={() => handleEdit(index, parentIndex)}>
                            <Icon name="edit" /> Edit
                        </CommentAction>
                        <CommentAction onClick={() => handleDelete(index, parentIndex)}>
                            <Icon name="trash" /> Delete
                        </CommentAction>
                        <CommentAction>
                            <Icon name="flag" /> Report
                        </CommentAction>
                    </CommentActions>
                </CommentContent>
                {comment.replies && comment.replies.length > 0 && (
                    <CommentGroup>{renderComments(comment.replies, index)}</CommentGroup>
                )}
                {replyingTo !== null && replyingTo.id === comment.comment_id && (
                    <Form reply onSubmit={handleSubmit}>
                        <FormTextArea
                            placeholder={'Write a reply...'}
                            value={newReply}
                            onChange={handleReplyChange}
                        />
                        <Input
                            type="file"
                            style={{ marginBottom: '-10px' }}
                            onChange={(e) => e?.target?.files?.length>0&&handleAttachmentChange(e)}
                        />
                        <ButtonGroup style={{float: "right"}}>
                            <Button onClick={()=>{ handleReply(null); setNewReply(""); }} secondary>Cancel</Button>
                            <ButtonOr />
                            <Button type='submit' content="Reply" labelPosition="left" icon="reply" primary />
                        </ButtonGroup>
                    </Form>
                )}
            </Comment>
        ));
    };

    return (
        <Container fluid={true}>
            <Form reply onSubmit={(e)=>handleSubmit(e)}>
                <FormTextArea
                    placeholder={'Write a comment...'}
                    value={newComment}
                    onChange={handleCommentChange}
                />
                <Input
                    type="file"
                    style={{ marginBottom: '-10px' }}
                    onChange={(e) => e?.target?.files?.length>0&&handleAttachmentChange(e)}
                />
                <Button style={{float:"right"}} icon="send" secondary />
            </Form>
            <CommentGroup>
                {data.length > 0 ? (
                    renderComments(data)
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </CommentGroup>
        </Container>
    );
};

const Comments = ({data, setData}) => {
    return (
        <Container fluid={true} style={{ marginTop: '2em', width: '55vw' }}>
            <CommentPage data={data} setData={setData} />
        </Container>
    );
};

export default Comments;
