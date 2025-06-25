import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Space from '../Space';
import Login from '../Login';

const PrivateRoute = ({ Component, login,...rest }) => {
	const [redirect, setRedirect] = useState(<></>)

	function isExpired(expirationTime) {
		// Get the current time in milliseconds
		if(!expirationTime) return true;
		const currentTime = Date.now();
		if (currentTime >= expirationTime) {
			localStorage.removeItem('auth');
		}
		return expirationTime < currentTime;
	  }

	useEffect(() => {
		if(isExpired(JSON.parse(localStorage.getItem('auth'))?.user?.stsTokenManager?.expirationTime)) {
			window.location.href = "/#/login";
			setRedirect(<Login />)
		} else if (login===undefined) {
			setRedirect(<Component {...rest} />)
		} else {
			window.location.href = "/#/space";
			setRedirect(<Space />)
		}
	}, [])

	return (
			redirect 
		)
}

export default PrivateRoute
