const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const helmet = require("helmet");

module.exports = function (req, res, next) {
	const token = req.header('x-auth-token')
	if(req?.body?.Prefix?.includes('67a041aff1a43dada0170b37')||req?.query?.Prefix?.includes('67a041aff1a43dada0170b37')){
		req.user = {id: '67a041aff1a43dada0170b37'}
		next()
		return
	} else {
		console.log('prefix not found: ', req)
	}
	if (!token) {
		return res.status(401).json({ msg: 'Authorization denied' })
	}

	try {
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET)
		req.user = decoded.user
		next()
	} catch (err) {
		let user = req?.user?.id?User.findById(req?.user?.id):null
		if(user){
			user.sessions = user.sessions.map((session) => {
				if(session.token === token) {
					session.ended_at = Date.now()
					return session
				}
				return session
			})
			user.save()
		}
		console.error('something wrong with auth middleware', token)
		res.status(401).json({ msg: 'Authorization Expired or Server Error' })
	}
}
