const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const helmet = require("helmet");

module.exports = function (req, res, next) {
	const token = req.header('x-auth-token')

	if (!token) {
		return res.status(401).json({ msg: 'Authorization denied' })
	}

	try {
		const origin = req.header('origin');
		const decoded = jwt.verify(token, origin?.includes('bucaudio')?process.env.REACT_APP_BUCAUDIO_JWT_SECRET:process.env.REACT_APP_JWT_SECRET)
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
