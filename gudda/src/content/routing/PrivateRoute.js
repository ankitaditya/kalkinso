import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ Component, ...rest }) => {
	const [redirect, setRedirect] = useState(<></>)

	useEffect(() => {
		if(!localStorage.getItem('auth')) {
			setRedirect(<Navigate to='/login' />)
		}
	}, [])

	return (
			redirect 
		)
}

export default PrivateRoute
