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
} from './types';
import { setAlert } from './alert';
import { setLoading } from './auth';

// Action to get all tasks
export const getTasks = (taskPath=null) => async dispatch => {
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
      dispatch({
        type: GET_TASKS,
        payload: taskPath&&taskPath!=='create'?res?.data.filter((card, index) => card.parentTasks.length === 0||sub_tasks.includes(card._id)):res?.data.filter((card, index) => card.parentTasks.length === 0),
      });
    }
    dispatch(setLoading(false));
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
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
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Action to add a new task
export const addTask = (taskData, task_id=null, Prefix=null) => async dispatch => {
  try {
    if (task_id) {
      taskData.parentTasks = [task_id];
    }
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
    window.location.reload();
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Action to update a task
export const updateTask = (id, taskData) => async dispatch => {
  try {
    const res = await axios.put(`/api/tasks/${id}`, {taskFields:taskData});
    dispatch({
      type: UPDATE_TASK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Action to delete a task
export const deleteTask = (id) => async dispatch => {
  try {
    await axios.delete(`/api/tasks/${id}`);
    dispatch({
      type: DELETE_TASK,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: TASKS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
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
      payload: { msg: err.response.statusText, status: err.response.status },
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