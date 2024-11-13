import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { keepAlive } from '../../actions/auth'

const PrivateRoute = ({ Component, ...rest }) => {
	const auth = useSelector(state => state.auth)
	const dispatch = useDispatch()
	const { isAuthenticated } = auth
	const [redirect, setRedirect] = useState(<></>)

	// useEffect(() => {
	// 	document.onclick = () => {
	// 		dispatch(keepAlive())
	// 	}
	// }, [])

	useEffect(() => {
		if(isAuthenticated){
			setRedirect(<Component {...rest} />)
		}
		if(!localStorage.getItem('token')) {
			setRedirect(<Navigate to='/login' />)
		}
	}, [isAuthenticated])

	return (
			redirect 
		)
}

export default PrivateRoute
