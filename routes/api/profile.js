const express = require('express')
const config = require('config')
const { body, validationResult } = require('express-validator')
const axios = require('axios')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const ChatSession = require('../../models/ChatSession')

const router = express.Router()

router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		})

		if (!profile) {
			return res
				.status(400)
				.json({ msg: 'There is no profile for this user' })
		}
		// const user = await User.findById(req.user.id)
		// profile.user = user
		res.json(profile)
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ msg: 'Server Error' })
	}
})

router.get('/user/:user_id', [auth] , async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		})
		const user = await User.findById(req.params.user_id)
		if (!profile || !user) {
			return res.status(400).json({ msg: 'Profile or User not found' })
		}
		profile.user = user
		res.json(profile)
	} catch (err) {
		console.error(err.message)
		if (err.kind === 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' })
		}
		res.status(500).json({ msg: 'Server Error' })
	}
})

router.post(
	'/',
	[
		auth,
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const {
			profileFields
		} = req.body

		try {
			let profile = await Profile.findOne({ user: req.user.id })
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				)
				return res.json(profile)
			}

			profile = new Profile(profileFields)
			await profile.save()

			res.json(profile)
		} catch (err) {
			console.error(err.message)
			res.status(500).json({ msg: 'Server Error' })
		}
	}
)


router.delete('/', auth, async (req, res) => {
	try {
		await ChatSession.deleteMany({ user: req.user.id })
		await Profile.deleteOne({ user: req.user.id })
		await User.deleteOne({ _id: req.user.id })
		res.json({ msg: 'User Deleted' })
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ msg: 'Server Error' })
	}
})

module.exports = router
