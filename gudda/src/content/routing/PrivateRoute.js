import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ Component, ...rest }) => {
	const [redirect, setRedirect] = useState(<></>)

	function isExpired(expirationTime) {
		// Get the current time in milliseconds
		if(!expirationTime) return true;
		const currentTime = Date.now();
	  
		// Check if the expiration time is before or after the current time
		return expirationTime < currentTime;
	  }

	useEffect(() => {
		if(isExpired(JSON.parse(localStorage.getItem('auth'))?.user?.stsTokenManager?.expirationTime)) {
			setRedirect(<Navigate to='/login' />)
		} else {
			setRedirect(<Component {...rest} />)
		}
	}, [])

	return (
			redirect 
		)
}

export default PrivateRoute
