import axios from 'axios';
import * as actionTypes from './types';
import { setAlert } from './alert';

export const sendMessage = (message, user, user_id) => async (dispatch) => {
    let payload = {
            "session": {
                "user": {...user, user_id: user_id},
                "timestamp": user.session.created_at,
                "session_id": user.session._id
            },
            "request": {
                "api_key": "sk-svcacct-16C5MqAnAgGhXhWdicxUT3BlbkFJrSevL2eqFeRBmV1lQDN4",
                "prompt": message,
                "chat_history": [],
                "model": "gpt-4o-mini",
                "temperature": 0.8,
                "top_p": 0.9,
                "frequency_penalty": 0,
                "presence_penalty": 0,
                "timestamp": user.session.created_at,
            }
    }
  try {
    const res = await axios.post('/api/kalkiai', {payload});
    dispatch({
      type: actionTypes.SEND_MESSAGE,
      payload: res?.data?.result.map((item) => {
        if (typeof item?.content==='string'&&item?.content?.match(/^(\{|\[).*(\}|\])$/)){
            return {
                role: item.role,
                content: JSON.parse(item.content),
            };
        } else {
            return {
                role: item.role,
                content: item.content,
            };
        }
      }),
    });
  } catch (err) {
    console.log(err);
    dispatch(setAlert('Error sending message', 'error'));
    dispatch({
      type: actionTypes.MESSAGE_ERROR,
      payload: err,
    });
  }
};

export const setLoadingMessage = (loading) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADING_MESSAGE,
    payload: loading,
  });
};

export const setChatSession = (session) => async (dispatch) => {
  dispatch({
    type: actionTypes.SEND_MESSAGE,
    payload: session,
  });
};