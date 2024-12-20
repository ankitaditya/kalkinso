import axios from 'axios'

import { setAlert } from './alert'
import * as actionTypes from './types'

export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/profile/me')
		dispatch({
			type: actionTypes.GET_PROFILE,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: actionTypes.PROFILE_ERROR,
			payload: {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			},
		})
	}
}

export const saveProfile = (profileFields) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}
		const res = await axios.post('/api/profile', {profileFields}, config)
		dispatch({
			type: actionTypes.GET_PROFILE,
			payload: res.data,
		})
		dispatch(setAlert('Profile Updated!', 'success'))
	} catch (err) {
		const errors = err.response.data.errors
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
		}
		dispatch({
			type: actionTypes.PROFILE_ERROR,
			payload: {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			},
		})
	}
}

export const getProfiles = () => async (dispatch) => {
	dispatch({ type: actionTypes.CLEAR_PROFILE })

	try {
		const res = await axios.get('/api/profile')
		dispatch({
			type: actionTypes.GET_PROFILES,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: actionTypes.PROFILE_ERROR,
			payload: {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			},
		})
	}
}

export const getProfileById = (userId) => async (dispatch) => {
	dispatch({ type: actionTypes.CLEAR_PROFILE })

	try {
		const res = await axios.get(`/api/profile/user/${userId}`)
		dispatch({
			type: actionTypes.GET_PROFILE,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: actionTypes.PROFILE_ERROR,
			payload: {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			},
		})
	}
}

export const getKitsUrl = (url) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/profile/kit/${url}`)
		dispatch({
			type: actionTypes.GET_KIT_URL,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: actionTypes.PROFILE_ERROR,
			payload: {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			},
		})
	}
}

export const createProfile = (formData, history, edit = false) => async (
	dispatch
) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}
		const res = await axios.post('/api/profile/', formData, config)
		dispatch({
			type: actionTypes.GET_PROFILE,
			payload: res.data,
		})
		window.scrollTo(0, 0)
		dispatch(
			setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
		)
		if (!edit) {
			history.push('/dashboard')
		}
	} catch (err) {
		const errors = err.response.data.errors
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
		}
		dispatch({
			type: actionTypes.PROFILE_ERROR,
			payload: {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			},
		})
	}
}


export const deleteAccount = () => async (dispatch) => {
	if (window.confirm('Are You sure ? This CANNOT be undone !')) {
		try {
			await axios.delete('/api/profile')
			dispatch({ type: actionTypes.CLEAR_PROFILE })
			dispatch({ type: actionTypes.DELETE_ACCOUNT })
			dispatch(setAlert('Your Account is Deleted'))
		} catch (err) {
			dispatch({
				type: actionTypes.PROFILE_ERROR,
				payload: {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				},
			})
		}
	}
}
