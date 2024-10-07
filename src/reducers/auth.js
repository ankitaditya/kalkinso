import * as actionTypes from '../actions/types'

const intialState = {
	token: localStorage.getItem('token'),
	isAuthenticated: false,
	loading: false,
	user: {
		"first_name": "John",
		"last_name": "Doe",
		"email": "john.doe@example.com",
		"mobile": "1234567890",
		"upi": "JOHND123",
		"adhar": 123456789012,
		"terms_conditions": "randomtermsandconditionsstring",
		"password": "password123",
		"avatar": "https://www.gravatar.com/avatar/anything?s=200&d=mm",
		"date": "2023-07-16T18:30:30.796Z"
	  },
	verification: null,
	openOtpModal: false,
	verified: {
		email: false,
		mobile: false,
		adhar: false,
		upi: false,
	  },
}

export default function authReducer(state = intialState, action) {
	switch (action.type) {
		case actionTypes.REGISTER_SUCCESS:
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				loading: false,
			}
		case actionTypes.LOGIN_SUCCESS:
			localStorage.setItem('token', action.payload.token)
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				loading: false,
			}
		case actionTypes.REGISTER_FAIL:
			return {
				...state,
				token: action?.payload,
				isAuthenticated: false,
				loading: false,
			}
		case actionTypes.AUTH_ERROR:
			return {
				...state,
				token: action?.payload,
				isAuthenticated: false,
				loading: false,
			}
		case actionTypes.LOGIN_FAIL:
			localStorage.removeItem('token')
			localStorage.removeItem('__data')
			return {
				...state,
				token: action?.payload,
				isAuthenticated: false,
				loading: false,
			}
		case actionTypes.LOGOUT:
			localStorage.removeItem('token')
			localStorage.removeItem('__data')
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
			}
		case actionTypes.DELETE_ACCOUNT:
			localStorage.removeItem('token')
			localStorage.removeItem('__data')
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
			}
		case actionTypes.USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: action.payload,
			}
		case actionTypes.OTP_VERIFICATION:
			return {
				...state,
				verification: action.payload,
			}
		case actionTypes.SET_VERIFIED:
			return {
				...state,
				verified: {...state.verified,...action.payload},
			}
		case actionTypes.OPEN_OTP_MODAL:
			return {
				...state,
				openOtpModal: action.payload,
			}
		case actionTypes.SET_LOADING:
			return {
				...state,
				loading: action.payload,
			}
		default:
			return state
	}
}
