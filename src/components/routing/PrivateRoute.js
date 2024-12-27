import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { keepAlive } from '../../actions/auth'

const PrivateRoute = ({ Component, access_page, ...rest }) => {
	const auth = useSelector(state => state.auth)
	const dispatch = useDispatch()
	const { isAuthenticated } = auth
	const [redirect, setRedirect] = useState(<></>)

	useEffect(() => {
		if(isAuthenticated&&(auth.user?.access?.includes(access_page) || !auth.user?.access)){
			setRedirect(<Component {...rest} />)
		}
		if(!localStorage.getItem('token') || (auth.user?.access&&!auth.user.access.includes(access_page))) {
			setRedirect(<Navigate to='/login' />)
		}
	}, [isAuthenticated])

	return (
			redirect 
		)
}

export default PrivateRoute
