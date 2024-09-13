import * as actionTypes from '../actions/types';

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
        default:
            return state
    }
}