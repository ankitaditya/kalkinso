import axios from 'axios';
import {
  GET_TASKS,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  TASKS_ERROR,
  SET_TASKS,
  GET_SUB_TASKS,
  SET_DELETE_FILE,
  UPDATE_MESSAGE,
} from './types';
import { setAlert } from './alert';
import { setLoading } from './auth';
import { cache } from '../utils/redux-cache';
import { getSelectedTasks } from './kits';

// Action to get all tasks
export const getTasks = (taskPath=null, from_cache=true) => async dispatch => {
  // if (from_cache) {
  //   if (cache({type:GET_TASKS, taskPath}, dispatch)) {
  //     dispatch(setLoading(false));
  //     return;
  //   }
  // }
  try {
    dispatch(setLoading(true));
    const res = await axios.get('/api/tasks');
    if (res?.data?.length === 0) {
      dispatch(setAlert('No tasks found', 'info'));
    } else {
      let sub_tasks = [...taskPath.split('&&')];
      if (taskPath) {
        res?.data.forEach((task) => {
          if (task.parentTasks.includes(taskPath.split('&&').slice(-1)[0])) {
            sub_tasks.push(task._id);
          }
        });
      }
      let data = window.localStorage.getItem('__data')?JSON.parse(window.localStorage.getItem('__data')):{};
      data[GET_TASKS] = {
        type: GET_TASKS,
        payload: taskPath&&taskPath!=='create'?res?.data.filter((card, index) => card.parentTasks.length === 0||sub_tasks.includes(card._id)):res?.data.filter((card, index) => card.parentTasks.length === 0),
      };
      // window.localStorage.setItem('__data', JSON.stringify(data));
      dispatch({
        type: GET_TASKS,
        payload: taskPath&&taskPath!=='create'?res?.data.filter((card, index) => card.parentTasks.length === 0||sub_tasks.includes(card._id)):res?.data.filter((card, index) => card.parentTasks.length === 0),
      });
    }
    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setAlert(err?.response?.statusText, 'info'));
  }
};

// Action to get all tasks
export const getTask = (task_id) => async dispatch => {
  try {
    dispatch(setLoading(true));
    const res = await axios.post('/api/tasks/subtasks', {task_id});
    dispatch({
      type: GET_TASKS,
      payload: {task_id:task_id,sub_tasks:res?.data},
    });
    dispatch(setLoading(false));
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

// Action to add a new task
export const addTask = (taskData, task_id=null, Prefix=null) => async dispatch => {
  try {
    if (task_id) {
      taskData.parentTasks = [task_id];
    }
    const taskPath = Prefix;
    if(Prefix?.split('&&')?.length>1){
      Prefix = Prefix.split('&&').join('/');
    } else if(Prefix&&Prefix==='create'){
      Prefix = null;
    }
    const res = await axios.post('/api/tasks', {
      task:taskData,
      task_id:task_id,
      Prefix:Prefix,
    });
    dispatch({
      type: ADD_TASK,
      payload: res.data,
    });
    dispatch({
      type: UPDATE_MESSAGE,
      payload: res.data,
    })
    dispatch(getTasks(taskPath, false))
    dispatch(getSelectedTasks('kalkinso.com', 'ankit.see', false));
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

// Action to update a task
export const updateTask = (id, taskData) => async dispatch => {
  try {
    const res = await axios.put(`/api/tasks/${id}`, {taskFields:taskData});
    if(window.location.hash.toLocaleLowerCase().includes('#/home.')){
      dispatch(getTasks(window.location.hash.toLocaleLowerCase().replace('#/home/',''), false))
      dispatch(getSelectedTasks('kalkinso.com', 'ankit.see', false));
    }
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

// Action to delete a task
export const deleteTask = (id) => async dispatch => {
  try {
    await axios.delete(`/api/tasks/${id}`);
    if(window.location.hash.toLocaleLowerCase().includes('#/home')){
      dispatch(getTasks(window.location.hash.toLocaleLowerCase().replace('#/home/',''), false))
      dispatch(getSelectedTasks('kalkinso.com', 'ankit.see', false));
    }
    dispatch({
      type: DELETE_TASK,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const setTasks = (search, task_id=null) => async dispatch => {

  try {
    dispatch(setLoading(true));
    const res = await axios.get(`/api/tasks/search/${search}`);
    dispatch({
                type: SET_TASKS,
                payload: res?.data,
              });
  } catch (err) {
    dispatch(setAlert(err?.response?.data?.msg, 'info'));
    dispatch({
      type: SET_TASKS,
      payload: [],
    });
  }
};


export const setOpenTask = (openTask) => {
    return {
      type: 'OPEN_TASK',
      payload: openTask,
    };
};

export const setIsMulti = (isMulti) => {
    return {
      type: 'IS_MULTI',
      payload: isMulti,
    };
}

export const setTasksState = (tasks) => {
    return {
      type: 'SET_TASKS_STATE',
      payload: tasks,
    };
}

export const getSubTasks = (task_id) => async dispatch => {
  try {
    const res = await axios.post('/api/tasks/subtasks', {task_id});
    dispatch({
      type: GET_SUB_TASKS,
      payload: res?.data,
    });
    dispatch(setLoading(false));
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
    dispatch(setLoading(false));
  }
};

export const setDeleteFile = (context) => {
    return {
      type: SET_DELETE_FILE,
      payload: context,
    };
}

export const addComment = (task_id, commentObject) => async dispatch => {
  try {
    const res = await axios.post(`/api/tasks/comment/${task_id}`, {commentObject});
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const addReaction = (task_id, reactionObject) => async dispatch => {
  try {
    const res = await axios.post(`/api/tasks/reaction/${task_id}`, {reactionObject});
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const addAttachment = (task_id, attachmentObject) => async dispatch => {
  try {
    const res = await axios.post(`/api/tasks/attachment/${task_id}`, {attachmentObject});
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const deleteAttachment = (task_id, attachment) => async dispatch => {
  try {
    const res = await axios.delete(`/api/tasks/delete-attachment/${task_id}/${attachment}`);
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const addReply = (task_id, comment_id, replyObject) => async dispatch => {
  try {
    const res = await axios.post(`/api/tasks/reply/${task_id}/${comment_id}`, {replyObject});
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const deleteComment = (task_id, comment_id) => async dispatch => {
  try {
    const res = await axios.delete(`/api/tasks/comment/${task_id}/${comment_id}`);
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const deleteReply = (task_id, comment_id, reply_id) => async dispatch => {
  try {
    const res = await axios.delete(`/api/tasks/reply/${task_id}/${comment_id}/${reply_id}`);
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const updateComment = (task_id, comment_id, commentObject) => async dispatch => {
  try {
    const res = await axios.put(`/api/tasks/comment/${task_id}/${comment_id}`, {commentObject});
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const updateReply = (task_id, comment_id, reply_id, replyObject) => async dispatch => {
  try {
    const res = await axios.put(`/api/tasks/reply/${task_id}/${comment_id}/${reply_id}`, {replyObject});
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const addCommentReaction = (task_id, comment_id, reactionObject) => async dispatch => {
  try {
    const res = await axios.post(`/api/tasks/reaction/${task_id}/${comment_id}`, {reactionObject});
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};

export const deleteCommentReaction = (task_id, comment_id) => async dispatch => {
  try {
    const res = await axios.delete(`/api/tasks/reaction/${task_id}/${comment_id}`);
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err?.response?.statusText, status: err?.response?.status },
    });
  }
};