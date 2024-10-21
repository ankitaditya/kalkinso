import axios from 'axios'

import { setAlert } from './alert'
import * as actionTypes from './types'
import setAuthToken from '../utils/setAuthToken'
import { getCurrentProfile } from './profile'

export const loadUser = ({token}) => async (dispatch) => {
	if (token) {
		setAuthToken(token)
	}
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}
	try {
		const res = await axios.get('/api/auth')
		dispatch({
			type: actionTypes.USER_LOADED,
			payload: res?.data,
		})
		dispatch(getCurrentProfile())
	} catch (err) {
		dispatch({
			type: actionTypes.AUTH_ERROR,
		})
		dispatch(setLoading(true))
		window.localStorage.removeItem('__data')
		window.location.href = `${window.location.origin}/#/login`
		setTimeout(() => dispatch(setLoading(false)), 1000)
	}
}

export const register = ({ first_name, last_name, email, mobile, upi, adhar, terms_conditions, password, confirm_password, user_role }) => async (dispatch) => {
	console.log('register is clicked!')
	setAuthToken(null)
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	const body = JSON.stringify({ first_name, last_name, email, mobile, upi, adhar, terms_conditions, password, user_role })
	try {
		const res = await axios.post('/api/users', body, config)
		console.log('RESULT: ', res)
		dispatch({
			type: actionTypes.REGISTER_SUCCESS,
			payload: res,
		})
		dispatch(setAlert(`Welcome ${first_name} ${last_name}, Successfully Registered!`, 'success'))
		dispatch(loadUser())
		dispatch(setLoading(false))
	} catch (err) {
		const errors = err?.response?.data
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error?.msg, 'error')))
			setTimeout(() => {
				dispatch(setLoading(false))
				// window.location.href = `${window.location.origin}/#/login`
			}, 1000)
		}
		dispatch(setLoading(false))
		dispatch({
			type: actionTypes.REGISTER_FAIL,
		})
	}
}

export const login = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	const body = JSON.stringify({ email, password })
	try {
		const res = await axios.post('/api/auth/login/email', body, config)
		dispatch(setLoading(true))
		console.log('RESULT: ', res)
		window.location.href = `${window.location.origin}/#/home/create`
		dispatch(setAlert(`Welcome ${res?.data?.first_name} ${res?.data?.last_name}!`, 'success'))
		dispatch({
			type: actionTypes.LOGIN_SUCCESS,
			payload: res?.data,
		})
		dispatch(loadUser({token:res?.data?.token}))
		dispatch(setLoading(false))
	} catch (err) {
		const errors = err?.response?.data?.errors
		// console.log('ERRORS: ', err)
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'error')))
		}
		dispatch({
			type: actionTypes.LOGIN_FAIL,
			payload: err,
		})
	}
}

export const logout = () => (dispatch) => {
	dispatch({
		type: actionTypes.CLEAR_PROFILE,
	})
	dispatch({
		type: actionTypes.LOGOUT,
	})
}

export const sendVerification = ({email=null, mobile=null, adhar=null, upi=null}) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	let bodyJson = {}
	let verifyType = ''
	if (email === null && mobile === null && adhar === null && upi === null) {
		dispatch(setAlert('Please provide a valid email or mobile or adhar or upi', 'error'))
		return
	} else if (email){
		bodyJson = { email }
		verifyType = 'email'
	} else if (mobile){
		bodyJson = { mobile }
		verifyType = 'mobile'
	} else if (adhar){
		bodyJson = { adhar:adhar.replace(/ /g, '') }
		verifyType = 'adhar'
	} else if (upi){
		bodyJson = { upi }
		verifyType = 'upi'
	}
	const body = JSON.stringify(bodyJson)
	try {
		const res = await axios.post(`/api/auth/send-${verifyType}-verification`, body, config)
		dispatch({
			type: actionTypes.OTP_VERIFICATION,
			payload: {[verifyType]:res.data},
		})
		dispatch(setOpenOtpModal(true))
		setTimeout(() => dispatch(setAlert(`OTP is sent to ${Object.values(bodyJson)[0]}!`, 'success')), 1000)
		return true;
	} catch (err) {
		const errors = err.response.data
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'error')))
		}
	}
}

export const verifyOtp = ({email=null, mobile=null, adhar=null, upi=null, otp=null}) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	let bodyJson = {}
	let verifyType = ''
	if (email === null && mobile === null && adhar === null && upi === null) {
		dispatch(setAlert('Please provide a valid OTP', 'error'))
		return
	} else if (email){
		bodyJson = { email, otp}
		verifyType = 'email'
	} else if (mobile){
		bodyJson = { mobile, otp}
		verifyType = 'mobile'
	} else if (adhar){
		bodyJson = { adhar, otp}
		verifyType = 'adhar'
	} else if (upi){
		bodyJson = { upi, otp}
		verifyType = 'upi'
	}
	const body = JSON.stringify(bodyJson)

	try {
		const res = await axios.post(`/api/auth/verify-${verifyType}-otp`, body, config);
		dispatch({
			type: actionTypes.OTP_VERIFICATION,
			payload: {[verifyType]:res.data},
		});
		console.log("THIS IS VERIFY OTP: ",mobile,otp,verifyType,bodyJson)
		dispatch(setAlert('OTP Verified!', 'success'));
		dispatch(setOpenOtpModal(false));
		dispatch(setVerified({[verifyType]:true}));
		return true;
	} catch (err) {
		const errors = err.response.data;
		dispatch(setVerified({[verifyType]:null}));
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
		}
	}
}

export const setVerified = (verifyObj) => async (dispatch) => {
	dispatch({
	  type: actionTypes.SET_VERIFIED,
	  payload: verifyObj,
	});
  };


export const setOpenOtpModal = (openOtpModal) => async (dispatch) => {
	dispatch({
		type: actionTypes.OPEN_OTP_MODAL,
		payload: openOtpModal,
	})
}

export const setLoading = (loading) => async (dispatch) => {
	dispatch({
		type: actionTypes.SET_LOADING,
		payload: loading,
	})
}
