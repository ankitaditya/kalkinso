import * as actionTypes from '../actions/types'

const intialState =   {};

export default function profileReducer(state = intialState, action) {
	switch (action.type) {
		case actionTypes.GET_PROFILE:
			return {
				...state,
				...action.payload,
				loading: false,
			}
		case actionTypes.UPDATE_PROFILE:
			return {
				...state,
				...action.payload,
				loading: false,
			}
		case actionTypes.GET_PROFILES:
			return {
				...state,
				profiles: action.payload,
				loading: false,
			}
		case actionTypes.GET_KIT_URL:
			return {
				...state,
				repos: action.payload,
				loading: false,
			}
		case actionTypes.CLEAR_PROFILE:
			return {
				...state,
				profile: null,
				repos: [],
				loading: false,
			}
		case actionTypes.PROFILE_ERROR:
			return {
				...state,
				error: action.payload,
				loading: false,
				profile: null,
			}
		default:
			return state
	}
}
