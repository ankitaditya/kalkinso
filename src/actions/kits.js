import * as actionTypes from '../actions/types';
import axios from 'axios';
import { setIsMulti, setOpenTask } from './task';
import { setLoading } from './auth';

export const getSelectedTasks = (bucketName="kalkinso.com", Prefix='ankit.see') => async (dispatch) => {
    try {
        Prefix=Prefix+'/'
        const res = await axios.post('/api/kits', {
            bucketName,
            Prefix,
        });
        dispatch({
            type: actionTypes.GET_SELECTED_TASK,
            payload: res.data,
        });
    } catch (err) {
        console.log(err);
        dispatch({
            type: actionTypes.TASK_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
  };

export const startTask = (bucketName="kalkinso.com", task_id=null, user_id=null) => async (dispatch) => {
    let Prefix = user_id ? `users/${user_id}/tasks/${task_id}/` : '';
    if(!Prefix){
        dispatch({
            type: actionTypes.TASK_ERROR,
            payload: { msg: 'Something Went Wrong. \nContact your administrator! => info@kalkinso.com', status: 404 },
        });
        return;
    }
    try {
        const res = await axios.post(`/api/kits`, {
            bucketName,
            Prefix,
        });
        dispatch({
            type: actionTypes.START_TASK,
            payload: {
                task_id: task_id,
                files: res.data,
            },
        });
        dispatch(setIsMulti(true))
        dispatch(setOpenTask(task_id))
        dispatch({
            type: actionTypes.SET_LOADING,
            payload: false,
        });
    } catch (err) {
        console.log(err);
        dispatch({
            type: actionTypes.TASK_ERROR,
            payload: { msg: err.response.msg, status: 400 },
        });
    }
  };

export const deleteFile = (bucketName="kalkinso.com", Prefix='', isTask=false) => async (dispatch) => {
    try {
        if (!Prefix) {
            dispatch({
                type: actionTypes.TASK_ERROR,
                payload: { msg: "File Path not found!", status: 404 },
            })
            dispatch(setLoading(false));
            return;
        }
        const res = await axios.post('/api/kits/delete', {
            bucketName,
            Prefix,
            isTask
        });
        dispatch({
            type: actionTypes.SET_DELETE_FILE,
            payload: null,
        });
        dispatch(setLoading(false));
        window.location.reload();
    } catch (err) {
        console.log(err);
        dispatch({
            type: actionTypes.TASK_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
  };