const express = require('express')
const auth = require('../../middleware/auth')
const ChatSession = require('../../models/ChatSession')
const User = require('../../models/User')
const ipAuth = require('../../middleware/ipAuth')

const router = express.Router()

router.post(
	'/',
	auth,
	ipAuth,
	async (req, res) => {
		try {
			const { chat_history } = req.body
			if (!chat_history) {
				res.status(400).json({ msg: 'Chat history is required' })
			}
			const user = await User.findById(req.user.id).select('-password')
			const new_session = new ChatSession({
				user: req.user.id,
				chat_history: chat_history,
			})
			if (!user) {
				return res.status(400).json({ msg: 'User not found' })
			}
			new_session.user = user
			const chat_session = await new_session.save()
			return res.json(chat_session)
		} catch (err) {
			console.error(err.message)
			return res.status(500).send('Server Error')
		}
	}
)

router.get('/', auth, ipAuth, async (req, res) => {
	try {
		const chat_session = await ChatSession.findOne({user:req.user.id}).sort({ date: -1 })
		return res.json(chat_session)
	} catch (err) {
		console.log(err.message)
		return res.status(500).send('Server Error')
	}
})

router.delete('/:id', auth, ipAuth, async (req, res) => {
	try {
		const chat_session = await ChatSession.findById(req.params.id)
		const user = await User.findById(req.user.id)
		if (!chat_session) {
			return res.status(404).json({ msg: 'Chat Session not found' })
		}
		if (chat_session.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' })
		}
		await chat_session.remove()
		return res.json({ msg: 'Chat Session Removed' })
	} catch (err) {
		console.log(err.message)
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Chat Session not found' })
		}
		return res.status(500).send('Server Error')
	}
})

router.put('/:id', auth, ipAuth, async (req, res) => {
	try {
		const chat_session = await ChatSession.findById(req.params.id)

		if (!chat_session) {
			return res.status(404).json({ msg: 'Chat Session not found' })
		}
		if (chat_session.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' })
		}
		const { chat_history } = req.body
		if (chat_history) chat_session.chat_history = chat_history
		await chat_session.save()
		return res.json(chat_session)
	} catch (err) {
		console.error(err.message)
		return res.status(500).send('Server Error')
	}
})

module.exports = router
