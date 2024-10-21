import * as actionTypes from '../actions/types';
import { removeObjectById, insertObjectById, renameIdAndReplaceObject, getObjectById } from '../utils/redux-cache';

const initialState = {
        selectedTask: {
            sortBy: ['title'],
            entries: []
        },
    };
  

export default function kitsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_SELECTED_TASK:
            return {
                ...state,
                selectedTask: action.payload,
            }
        case actionTypes.RENAME_FILE:
            let entryObject = getObjectById(state.selectedTask.entries[0], action.payload.file_id);
            entryObject.title = action.payload.new_file_id.split('/').slice(-1)[0];
            entryObject.value = action.payload.new_file_id.split('/').slice(-1)[0];
            entryObject.fileType = action.payload.new_file_id.split('.').slice(-1)[0];
            entryObject.signedUrl = action.payload.signedUrl;
            return {
                ...state,
                selectedTask: {
                    ...state.selectedTask,
                    entries: [renameIdAndReplaceObject(state.selectedTask.entries[0], action.payload.file_id, action.payload.new_file_id, entryObject)],
                }
            }
        case actionTypes.ADD_FILE:
            return {
                ...state,
                selectedTask: {
                    ...state.selectedTask,
                    entries: [insertObjectById(state.selectedTask.entries[0], action.payload.id, action.payload.value)],
                }
            }
        case actionTypes.DELETE_FILE:
            return {
                ...state,
                selectedTask: {
                    ...state.selectedTask,
                    entries: [removeObjectById(state.selectedTask.entries[0], action.payload)],
                }
            }
        default:
            return state
    }
}