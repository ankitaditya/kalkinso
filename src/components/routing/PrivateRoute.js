import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ Component, ...rest }) => {
	const auth = useSelector(state => state.auth)
	const { isAuthenticated } = auth
	const [redirect, setRedirect] = useState(<></>)
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
