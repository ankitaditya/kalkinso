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
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid4 } from 'uuid';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { addComment, addCommentReaction, addReaction, addReply, deleteComment, deleteCommentReaction, deleteReply, updateComment } from '../../../../../actions/task';
import { formatDistanceToNow } from 'date-fns';
import Thumbnail from './Thumbnail';

const CommentPage = ({data, setData}) => {
    const [newComment, setNewComment] = useState('');
    const [newReply, setNewReply] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const profile = useSelector((state) => state.profile);
    const { taskPath } = useParams();
    const dispatch = useDispatch();

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleReplyChange = (e) => {
        setNewReply(e.target.value);
    };

    const handleAttachmentChange = (e) => {
        // console.log('attachment: ', e.target.files[0]);
        let file = e.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }
        const params = {
            Bucket: 'kalkinso.com',
            Key: `users/${profile?.user}/tasks/${taskPath.split('&&').join('/')}/comments/${e.target.files[0].name}`,
            ContentType: file.type,
        };
        const formData = new FormData();
        formData.append('file', file);
        formData.append('params', JSON.stringify(params));
        axios.post('/api/kits/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }}).then((response) => {
                setAttachment({
                    name: e.target.files[0].name,
                    type: e.target.files[0].type,
                    url: `users/${profile?.user}/tasks/${taskPath.split('&&').join('/')}/comments/${e.target.files[0].name}`,
                    signedUrl: response.data.url,
                });
            }).catch((error) => {
                console.error('Error uploading file:', error);
            });
        console.log(`users/${profile?.user}/tasks/${taskPath.split('&&').join('/')}/comments/${e.target.files[0].name}`);
    };

    const handleSubmit = (e) => {
        if (newComment || newReply) {
            const newEntry = newComment ?{
                user: profile.user, 
                _id: uuid4(),
                text: newComment,
                attachment: attachment?.type?{
                    type: attachment?.type,
                    name: attachment?.name,
                    url: attachment?.url
                }:{},
                reaction: [],
                reply_to: []
            }: {
                user: profile.user, 
                _id: uuid4(),
                text: newReply,
                attachment: attachment?.type?{
                    type: attachment?.type,
                    name: attachment?.name,
                    url: attachment?.url
                }:{},
                reaction: [],
                reply_to: []
            };

            if (replyingTo !== null) {
                const updatedComments = [...data];
                updatedComments[replyingTo.index].reply_to.push(newEntry);
                setData(updatedComments);
                dispatch(addReply(taskPath.split('&&').slice(-1)[0], updatedComments[replyingTo.index]._id, newEntry));
                setReplyingTo(null);
            } else {
                dispatch(addComment(taskPath.split('&&').slice(-1)[0], newEntry));
                setData([newEntry, ...data]);
            }

            setNewComment('');
            setAttachment(null);
        }
    };

    const handleLike = (index, parentIndex = null) => {
        let updatedComments = [...data];
        if (parentIndex !== null) {
            // updatedComments[parentIndex].reply_to[index].reaction = [...updatedComments[parentIndex].reply_to[index].reaction, { user: profile.user, reaction: 1 }];
        } else {
            // updatedComments[index].reaction = [...updatedComments[index].reaction, { user: profile.user, reaction: 1 }];
            if(updatedComments[index].reaction.find(rec=>rec.user===profile.user)){
                dispatch(deleteCommentReaction(taskPath.split('&&').slice(-1)[0], updatedComments[index]._id, profile.user));
            } else {
                dispatch(addCommentReaction(taskPath.split('&&').slice(-1)[0], updatedComments[index]._id, { user: profile.user, reaction: 1 }));
            }
        }
        setData(updatedComments);
    };

    const handleDelete = (index, parentIndex = null) => {
        if (parentIndex !== null) {
            let updatedComments = [...data];
            dispatch(deleteReply(taskPath.split('&&').slice(-1)[0],updatedComments[parentIndex]._id, updatedComments[parentIndex].reply_to[index]._id));
            updatedComments[parentIndex].reply_to = updatedComments[parentIndex].reply_to.filter(
                (_, i) => i !== index
            );
            setData(updatedComments);
        } else {
            dispatch(deleteComment(taskPath.split('&&').slice(-1)[0],data[index]._id));
            setData(data.filter((_, i) => i !== index));
        }
    };

    const handleEdit = (index, parentIndex = null) => {
        if (parentIndex !== null) {
            const commentToEdit = data[parentIndex].reply_to[index];
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
        console.log('attachment: ', attachment);
        if(Object.keys(attachment).length === 0) return <></>;
        if (attachment?.type?.includes('image')) {
            return <Thumbnail src={attachment?.signedUrl?attachment?.signedUrl:attachment?.url} alt={attachment?.name} relative={attachment?.signedUrl?false:true} />;
        } else {
            return (
                <Thumbnail src={`https://via.placeholder.com/100?text=${attachment.name}`} alt={attachment?.name} relative={false} />
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
                        <div>{comment?.timestamp?formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true }):""}</div>
                    </CommentMetadata>
                    <CommentText>{comment.text}</CommentText>
                    {comment.attachment && (
                        <AttachmentThumbNail attachment={comment.attachment} />
                    )}
                    <CommentActions>
                        <CommentAction onClick={() => handleLike(index, parentIndex)}>
                            <Icon name="thumbs up" /> {comment.reaction?.length} {comment.reaction?.find(rec=>rec.user===profile.user)?"Remove":"Like"}
                        </CommentAction>
                        <CommentAction onClick={() => handleReply({index,id:comment._id})}>
                            <Icon name="reply" /> Reply
                        </CommentAction>
                        {comment?.user&&comment?.user===profile?.user&&(<><CommentAction onClick={() => handleEdit(index, parentIndex)}>
                            <Icon name="edit" /> Edit
                        </CommentAction>
                        <CommentAction onClick={() => handleDelete(index, parentIndex)}>
                            <Icon name="trash" /> Delete
                        </CommentAction></>)}
                        <CommentAction>
                            <Icon name="flag" /> Report
                        </CommentAction>
                    </CommentActions>
                </CommentContent>
                {comment.reply_to && comment.reply_to.length > 0 && (
                    <CommentGroup>{renderComments(comment.reply_to, index)}</CommentGroup>
                )}
                {replyingTo !== null && replyingTo.id === comment._id && (
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
                <Button type="submit" style={{float:"right"}} icon="send" secondary />
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
