import * as actionTypes from '../actions/types';

const initialState = {
    chatSessions: [],
    currentSession: [
        {role: "assistant", content: "Hello there! I am an assistant for your idea implementation? You can generate tasks, create plans, and much more. How can I help you today?"},
    ],
    messages: [],
    isMulti: false,
    openTask: false,
    loading: false,
    modifiedTabs: {},
    pageHeader: {},
    };

export default function chatSessionsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_CHAT_SESSIONS:
            return {
                ...state,
                chatSessions: action.payload,
                loading: false,
            }
        case actionTypes.GET_CHAT_SESSION:
            return {
                ...state,
                currentSession: action.payload,
                loading: false,
            }
        case actionTypes.GET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
                loading: false,
            }
        case actionTypes.CLEAR_CHAT_SESSION:
            return {
                ...state,
                currentSession: null,
                messages: [],
                loading: false,
            }
        case actionTypes.CHAT_SESSION_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
                currentSession: null,
            }
        case actionTypes.SET_LOADING_MESSAGE:
            return {
                ...state,
                loading: action.payload,
            }
        case actionTypes.SEND_MESSAGE:
            return {
                ...state,
                currentSession: [...state.currentSession, action.payload.slice(-1)[0]],
                loading: false,
            }
        case actionTypes.UPDATE_MESSAGE:
            let tempCurrentSession = state.currentSession;
            if (tempCurrentSession[tempCurrentSession.length-1].content.id === action.payload.id) {
                tempCurrentSession[tempCurrentSession.length-1].content.id = action.payload._id;
                if (action.payload?.subTasks?.length > 0 && tempCurrentSession[tempCurrentSession.length-1].content.task_lists?.length > 0) {
                    tempCurrentSession[tempCurrentSession.length-1].content.task_lists = tempCurrentSession[tempCurrentSession.length-1].content?.task_lists?.map((task) => {
                        let subTaskObject = action.payload.subTasks.find((subTask) => subTask.id === task.id);
                        if (subTaskObject) {
                            return {
                                ...task,
                                id: subTaskObject.key,
                            }
                        } else {
                            return task;
                        }
                    });
                }
            }
            return {
                ...state,
                currentSession: tempCurrentSession,
                loading: false,
            }
        default:
            return state
    }
}