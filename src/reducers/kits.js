import * as actionTypes from '../actions/types';
import { removeObjectById, insertObjectById, renameIdAndReplaceObject, getObjectById } from '../utils/redux-cache';

const initialState = {
        selectedTask: {
            sortBy: ['title'],
            entries: []
        },
        selectedTool: {
            name: '',
            entries: [],
            selectedEntry: {}
        }
    };
  

export default function kitsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_SELECTED_TASK:{
            return {
                ...state,
                selectedTask: action.payload,
            }}
        case actionTypes.RENAME_FILE:{
            let entries = Object.assign({}, state.selectedTask.entries[0]);
            let entryObject = getObjectById(state.selectedTask.entries[0], action.payload.file_id);
            entryObject.title = action.payload.new_file_id.split('/').slice(-1)[0];
            entryObject.value = action.payload.new_file_id.split('/').slice(-1)[0];
            entryObject.fileType = action.payload.new_file_id.split('.').slice(-1)[0];
            entryObject.signedUrl = action.payload.signedUrl;
            entries = state.selectedTask.entries[0];
            return {
                ...state,
                selectedTask: {
                    ...state.selectedTask,
                    entries: [renameIdAndReplaceObject(entries, action.payload.file_id, action.payload.new_file_id, entryObject)],
                }
            }}
        case actionTypes.ADD_FILE:{
            let entries = Object.assign({}, state.selectedTask.entries[0]);
            return {
                ...state,
                selectedTask: {
                    ...state.selectedTask,
                    entries: [insertObjectById(entries, action.payload.id, action.payload.value)],
                }
            }}
        case actionTypes.DELETE_FILE:{
            let entries = Object.assign({}, state.selectedTask.entries[0]);
            return {
                ...state,
                selectedTask: {
                    ...state.selectedTask,
                    entries: [removeObjectById(entries, action.payload)],
                }
            }}
        case actionTypes.SET_SELECTED_TOOL:{
            return {
                ...state,
                selectedTool: action.payload,
            }}
        default:
            return state
    }
}