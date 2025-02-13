import axios from 'axios'

import { setAlert } from './alert'
import * as actionTypes from './types'
import setAuthToken from '../utils/setAuthToken'
import { getCurrentProfile } from './profile'
import { getIpInfo } from '../utils/utils'



export const saveUserDeviceInfo = () => async (dispatch) => {
	const deviceInfo = await getIpInfo()
	dispatch({
		type: actionTypes.SAVE_USER_DEVICE_INFO,
		payload: deviceInfo,
	})
}

export const keepAlive = () => async (dispatch) => {
	try {
		if (localStorage.token) {
			const res = await axios.get('/api/auth/keep-alive')
			dispatch(loadUser({token:res?.data?.token}))
		} else {
			if (!['login', 'register', 'search', '#', 'privacy-policy', 'terms-n-conditions', 'contact'].includes(window.location.href.split('/').slice(-1)[0])) {
				window.location.href = `${window.location.origin}/#/login`
			}
		}
	} catch (err) {
		dispatch({
			type: actionTypes.AUTH_ERROR,
		})
		dispatch(setLoading(true))
		window.localStorage.removeItem('__data')
		if (!['login', 'register', 'search', '#', 'privacy-policy', 'terms-n-conditions', 'contact'].includes(window.location.href.split('/').slice(-1)[0])) {
			window.location.href = `${window.location.origin}/#/login`
		}
		setTimeout(() => dispatch(setLoading(false)), 1000)
	}
}

export const loadUser = ({token}) => async (dispatch) => {
	if (token) {
		setAuthToken(token)
	}
	if (!token&&localStorage.token) {
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
		if (!['login', 'register', 'search', '#', 'privacy-policy', 'terms-n-conditions', 'contact'].includes(window.location.href.split('/').slice(-1)[0])){
			window.location.href = `${window.location.origin}`
		}
		setTimeout(() => dispatch(setLoading(false)), 1000)
	}
}

export const registerWithEmail = async ({email, first_name, last_name}) => {
    const config = {
		headers: {
			'Content-Type': 'application/json',
		}
	}
	const body = JSON.stringify({ first_name, last_name, email, mobile: "", upi: "", adhar: "", terms_conditions: true, password: "", user_role: "", access: ["DASH","HOME","ORDERS","AI","WALLET"] })
    try {
        const res = await axios.post('/api/users', body, config)
        console.log(res.data)
        return res.data
    } catch (err) {
        console.error(err)
        return { error: err }
    }
}

export const register = ({ first_name, last_name, email, mobile, upi, adhar, terms_conditions, password, confirm_password, user_role, access }) => async (dispatch) => {
	// console.log('register is clicked!')
	setAuthToken(null)
	dispatch(saveUserDeviceInfo())
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	const body = JSON.stringify({ first_name, last_name, email, mobile, upi, adhar: adhar.slice(-4), terms_conditions, password, user_role, access: ["DASH","HOME","ORDERS","AI","WALLET"] })
	try {
		const res = await axios.post('/api/users', body, config)
		// console.log('RESULT: ', res)
		dispatch({
			type: actionTypes.REGISTER_SUCCESS,
			payload: res,
		})
		dispatch(setAlert(`Welcome ${first_name} ${last_name}, Successfully Registered!`, 'success'))
		window.location.href = `${window.location.origin}/#/login`
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
	dispatch(saveUserDeviceInfo())
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	const body = JSON.stringify({ email, password })
	try {
		const res = await axios.post('/api/auth/login/email', body, config)
		dispatch(setLoading(true))
		// console.log('RESULT: ', res)
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

export const sendVerification = ({email=null, mobile=null, adhar=null, upi=null, consent='Y'}) => async (dispatch) => {
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
		bodyJson = { adhar:adhar.replace(/\s+/g, ''), consent }
		verifyType = 'adhar'
	} else if (upi){
		bodyJson = { upi, consent }
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
		if (res?.data?.data?.data?.message||res?.data?.sid){
			setTimeout(() => dispatch(setAlert(`${res?.data?.data?.data?.message||res?.data?.message||"Successfully sent OTP "}!`, res?.data?.data?.data?.message?.includes('Invalid')?'error':'success')), 1000)
		} else {
			setTimeout(() => dispatch(setAlert(`Error sending request!`, 'error')), 1000)
			// window.location.href = `${window.location.origin}/#/unknown-error`
		}
		return true;
	} catch (err) {
		const errors = err.response.data
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'error')))
		}
	}
}

export const sendVerificationLogin = ({email=null, mobile=null, adhar=null, upi=null, consent='Y'}) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	let demo = false
	let bodyJson = {}
	let verifyType = ''
	if (email === null && mobile === null && adhar === null && upi === null) {
		dispatch(setAlert('Please provide a valid email or mobile or adhar or upi', 'error'))
		return
	} else if (email){
		if (email === 'info@kalkinso.com'){
			demo = true
		}
		bodyJson = { email }
		verifyType = 'email'
	} else if (mobile){
		bodyJson = { mobile }
		verifyType = 'mobile'
	} else if (adhar){
		bodyJson = { adhar:adhar.replace(/\s+/g, ''), consent }
		verifyType = 'adhar'
	} else if (upi){
		bodyJson = { upi, consent }
		verifyType = 'upi'
	}
	const body = JSON.stringify({...bodyJson, demo})
	try {
		const res = await axios.post(`/api/auth/send-login-${verifyType}-verification`, body, config)
		dispatch({
			type: actionTypes.OTP_VERIFICATION,
			payload: {[verifyType]:res.data},
		})
		dispatch(setOpenOtpModal(true))
		if (res?.data?.data?.data?.message||res?.data?.sid){
			setTimeout(() => dispatch(setAlert(`${res?.data?.data?.data?.message||res?.data?.message||"Successfully sent OTP "}!`, res?.data?.data?.data?.message?.includes('Invalid')?'error':'success')), 1000)
			dispatch(setLoading(false))
		} else {
			setTimeout(() => dispatch(setAlert(`Error sending request!`, 'error')), 1000)
			// window.location.href = `${window.location.origin}/#/unknown-error`
		}
		return true;
	} catch (err) {
		dispatch(setAlert("User not found!", 'error'))
		dispatch(setLoading(false));
		window.location.href = `${window.location.origin}/#/login`
		window.location.reload()
	}
}

export const verifyUpi = ({upi=null, name=null}) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	if (upi === null || name === null) {
		dispatch(setAlert('Please provide a valid UPI and Name', 'error'))
		return
	}
	const body = JSON.stringify({ upi, name })
	try {
		const res = await axios.post('/api/auth/verify-upi', body, config)
		dispatch({
			type: actionTypes.OTP_VERIFICATION,
			payload: {upi:res.data},
		})
		dispatch(setOpenOtpModal(true))
		if (res?.data?.data?.data?.account_exists){
			setTimeout(() => dispatch(setAlert(`UPI Successfully Verified!`, 'success')), 1000)
			dispatch(setVerified({upi:true}));
		} else {
			setTimeout(() => dispatch(setAlert(`UPI Not Successfully Verified!`, 'error')), 1000)
			// window.location.href = `${window.location.origin}/#/unknown-error`
		}
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
	let demo = false
	let bodyJson = {}
	let verifyType = ''
	if (email === null && mobile === null && adhar === null && upi === null) {
		dispatch(setAlert('Please provide a valid OTP', 'error'))
		return
	} else if (email){
		if (email.replace(/\s+/g, '') === 'info@kalkinso.com'){
			demo = true
		}
		bodyJson = { email:email.replace(/\s+/g, ''), otp}
		verifyType = 'email'
	} else if (mobile){
		bodyJson = { mobile:mobile.replace(/\s+/g, ''), otp}
		verifyType = 'mobile'
	} else if (adhar){
		bodyJson = { reference_id:adhar.toString(), otp}
		verifyType = 'adhar'
	} else if (upi){
		bodyJson = { reference_id:upi.toString(), otp}
		verifyType = 'upi'
	}
	const body = JSON.stringify({...bodyJson, demo})

	try {
		const res = await axios.post(`/api/auth/verify-${verifyType}-otp`, body, config);
		dispatch({
			type: actionTypes.OTP_VERIFICATION,
			payload: {[verifyType]:res.data},
		});
		// console.log("THIS IS VERIFY OTP: ",mobile,otp,verifyType,bodyJson)
		if (res?.data?.data?.data?.message||res?.data?.message){
			setTimeout(() => dispatch(setAlert(`${res?.data?.data?.data?.message||res?.data?.message||"OTP Verified "}!`, res?.data?.data?.data?.message?.includes('Invalid')?'error':'success')), 1000)
			if (!res?.data?.data?.data?.message?.includes('Invalid')) {
				dispatch(setVerified({[verifyType]:true}));
			}
		} else {
			setTimeout(() => dispatch(setAlert(`Error sending request!`, 'error')), 1000)
			// window.location.href = `${window.location.origin}/#/unknown-error`
		}
		dispatch(setOpenOtpModal(false));
	} catch (err) {
		const errors = err.response.data;
		dispatch(setVerified({[verifyType]:null}));
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
		}
	}
}

export const otpLogin = ({email=null, mobile=null, adhar=null, upi=null, otp=null}) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	let demo = false
	let bodyJson = {}
	let verifyType = ''
	if (email === null && mobile === null && adhar === null && upi === null) {
		dispatch(setAlert('Please provide a valid OTP', 'error'))
		return
	} else if (email){
		if (email.replace(/\s+/g, '') === 'info@kalkinso.com'){
			demo = true
		}
		bodyJson = { email:email.replace(/\s+/g, ''), otp}
		verifyType = 'email'
	} else if (mobile){
		bodyJson = { mobile:mobile.replace(/\s+/g, ''), otp}
		verifyType = 'mobile'
	} else if (adhar){
		bodyJson = { reference_id:adhar.toString(), otp}
		verifyType = 'adhar'
	} else if (upi){
		bodyJson = { reference_id:upi.toString(), otp}
		verifyType = 'upi'
	}
	const body = JSON.stringify({...bodyJson, demo})

	try {
		const res = await axios.post(`/api/auth/verify-login-${verifyType}-otp`, body, config);
		dispatch({
			type: actionTypes.OTP_VERIFICATION,
			payload: {[verifyType]:res.data},
		});
		if(res.data?.token){
			dispatch(loadUser({token: res.data.token}));
			dispatch(setAlert("Successfully Logged In!", 'success'));
			setTimeout(() => {
				window.location.href = `${window.location.origin}/#/home/create`;
				dispatch(setLoading(false));
			}, 1000);
		}
		// console.log("THIS IS VERIFY OTP: ",mobile,otp,verifyType,bodyJson)
		if (res?.data?.data?.data?.message||res?.data?.message){
			setTimeout(() => dispatch(setAlert(`${res?.data?.data?.data?.message||res?.data?.message||"OTP Verified "}!`, res?.data?.data?.data?.message?.includes('Invalid')?'error':'success')), 1000)
			if (!res?.data?.data?.data?.message?.includes('Invalid')) {
				dispatch(setVerified({[verifyType]:true}));
			}
		} else {
			setTimeout(() => dispatch(setAlert(`Error sending request!`, 'error')), 1000)
			setLoading(false);
			// window.location.href = `${window.location.origin}/#/unknown-error`
		}
	} catch (err) {
		const errors = err?.msg;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
		}
		dispatch(setLoading(false));
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

export const reset = (password, password2) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
	const body = JSON.stringify({ password, password2 })
	try {
		const res = await axios.post('/api/users/reset-password', body, config)
		dispatch({
			type: actionTypes.RESET_SUCCESS,
			payload: res.data,
		})
		dispatch(setAlert('Password Reset Successfully!', 'success'))
		window.location.href = `${window.location.origin}/#/login`
	} catch (err) {
		const errors = err.response.data
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'error')))
		}
		dispatch({
			type: actionTypes.RESET_FAIL,
		})
	}
}
