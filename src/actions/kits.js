import * as actionTypes from '../actions/types';
import axios from 'axios';
import { getTasks, setIsMulti, setOpenTask } from './task';
import { setLoading } from './auth';
import { cache, generateSignedUrl } from '../utils/redux-cache';
import { setAlert } from './alert';

export const getSelectedTasks = (bucketName="kalkinso.com", Prefix='ankit.see') => async (dispatch) => {
    try {
        Prefix=Prefix+'/'
        const res = await axios.post('/api/kits', {
            bucketName,
            Prefix,
        });
        let data = window.localStorage.getItem('__data')?JSON.parse(window.localStorage.getItem('__data')):{};
        data[actionTypes.GET_SELECTED_TASK] = {
            type: actionTypes.GET_SELECTED_TASK,
            payload: res.data,
        };
        // window.localStorage.setItem('__data', JSON.stringify(data));
        dispatch({
            type: actionTypes.GET_SELECTED_TASK,
            payload: res.data,
        });
        dispatch(setLoading(false));
    } catch (err) {
        console.log(err);
        dispatch({
            type: actionTypes.TASK_ERROR,
            payload: { msg: err?.response?.statusText, status: err?.response?.status },
        });
    }
  };

export const startTask = (bucketName="kalkinso.com", task_id=null, user_id=null) => async (dispatch) => {
    let Prefix = user_id ? `users/${user_id}/tasks/${window.location.hash.toLocaleLowerCase().includes('#/home')&&window.location.hash.toLocaleLowerCase().replace('#/home/','')!=='create'?window.location.hash.toLocaleLowerCase().replace('#/home/','').replace('&&','/')+'/':''}${task_id}/` : '';
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
        // console.log(err);
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
            type: actionTypes.DELETE_FILE,
            payload: Prefix,
        });
        dispatch(setLoading(false));
    } catch (err) {
        // console.log(err);
        dispatch({
            type: actionTypes.TASK_ERROR,
            payload: { msg: err.response?.statusText, status: err?.response?.status },
        });
    }
  };

export const renameFile = (payload) => async (dispatch) => {
    const bucketname = 'kalkinso.com';
    let file_id = payload.id.split('/');
    let new_file_id = payload.id.split('/');
    new_file_id.splice(-1,1,payload.title);
    payload.id = new_file_id.join('/');
    if(!payload.fileType){
        payload.id+='/';
    }
    const params = {
        Bucket : bucketname,
        CopySource : bucketname+'/'+file_id.join('/'), 
        Key : new_file_id.join('/'),
    };
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    // console.log(params)
    try {
        const resp = await axios.post('/api/kits/copy', params, config);
        dispatch(deleteFile(bucketname, file_id.join('/')));
        const signedUrl = await generateSignedUrl('kalkinso.com', new_file_id.join('/'));
        dispatch(setLoading(false));
        dispatch({
            type: actionTypes.RENAME_FILE,
            payload: {
                file_id: file_id.join('/'),
                new_file_id: new_file_id.join('/'),
                signedUrl: signedUrl,
            },
        });
    } catch (err) {
        // console.log(err);
        return dispatch({
            type: actionTypes.TASK_ERROR,
            payload: { msg: err.response?.statusText, status: err.response?.status },
        });
    }
}

export const addFile = (id) => async (dispatch) => {
    const signedUrl = await generateSignedUrl('kalkinso.com', id);
    dispatch({
        type: actionTypes.ADD_FILE,
        payload:{
            id: id.split('/').slice(0,-1).join('/')+'/',
            value: {
                id: id,
                icon: 'Document',
                title: id.split('/').slice(-1)[0],
                value: id.split('/').slice(-1)[0],
                fileType: id.split('.').slice(-1)[0],
                signedUrl: signedUrl,
            },
        },
    });
    dispatch(setAlert('File Added!', 'success'));
};

export const addFileTool = (id) => async (dispatch) => {
    const signedUrl = await generateSignedUrl('kalkinso.com', id);
    dispatch({
        type: actionTypes.ADD_FILE,
        payload:{
            id: id.split('/').slice(0,-1).join('/')+'/',
            value: {
                id: id,
                icon: 'Document',
                title: id.split('/').slice(-1)[0],
                value: id.split('/').slice(-1)[0],
                fileType: id.split('.').slice(-1)[0],
                signedUrl: signedUrl,
            },
        },
    });
    // dispatch(setAlert('File Added!', 'success'));
};

export const save = (bucketName="kalkinso.com", Prefix='', content=null, newFile=false) => async (dispatch) => {
    if (!bucketName){
        dispatch(setAlert('Bucket Name not found!', 'error'));
        return;
    }
    if (!Prefix){
        dispatch(setAlert('File Path not found!', 'error'));
        return;
    }
    if (!content){
        dispatch(setAlert('No content to save!', 'error'));
    }
    const params = JSON.stringify({params:{
        Bucket: bucketName,
        Key: Prefix,
        Body: content,
    }});
    try {
        const res = await axios.put('/api/kits/save', params, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const signedUrl = await generateSignedUrl('kalkinso.com', Prefix);
        if(newFile){
            dispatch(addFile(Prefix));
        } else {
            dispatch({
                type: actionTypes.RENAME_FILE,
                payload: {
                    file_id: Prefix,
                    new_file_id: Prefix,
                    signedUrl: signedUrl,
                },
            });
        }
        dispatch(setLoading(false));
    } catch (err) {
        console.log(err);
        dispatch(setAlert('File not saved!', 'error'));
        dispatch(setLoading(false));
    }
  };

  export const saveTools = (bucketName="kalkinso.com", Prefix='', content=null, newFile=false) => async (dispatch) => {
    if (!bucketName){
        dispatch(setAlert('Bucket Name not found!', 'error'));
        return;
    }
    if (!Prefix){
        dispatch(setAlert('File Path not found!', 'error'));
        return;
    }
    if (!content){
        dispatch(setAlert('No content to save!', 'error'));
    }
    const params = JSON.stringify({params:{
        Bucket: bucketName,
        Key: Prefix,
        Body: content,
    }});
    try {
        const res = await axios.put('/api/kits/save', params, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const signedUrl = await generateSignedUrl('kalkinso.com', Prefix);
        if(newFile){
            dispatch(addFileTool(Prefix));
        } else {
            dispatch({
                type: actionTypes.RENAME_FILE,
                payload: {
                    file_id: Prefix,
                    new_file_id: Prefix,
                    signedUrl: signedUrl,
                },
            });
        }
        dispatch(setLoading(false));
    } catch (err) {
        console.log(err);
        dispatch(setAlert('File not saved!', 'error'));
        dispatch(setLoading(false));
    }
  };

export const getSelectedTool = (name, data, selectedTool={}) => async (dispatch) => {
    dispatch({
        type: actionTypes.SET_SELECTED_TOOL,
        payload: {
            name: name,
            entries: data,
            selectedEntry: selectedTool,
        },
    });
};