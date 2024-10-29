require('dotenv').config();
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const twilio = require('twilio');
const { body, validationResult } = require('express-validator')
const axios = require('axios')
const auth = require('../../middleware/auth')

const User = require('../../models/User')

const router = express.Router()
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const verifyServiceSid = process.env.TWILIO_SERVICE_SID;

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req?.user?.id).select('-password')
		let user_session = user.sessions.sort((a,b)=>b.created_at-a.created_at)[0]
		if (!user) {
			return res.status(404).json({ msg: 'User not found' })
		}
		if(!user_session) {
			return res.status(404).json({ msg: 'Session not created' })
		}
		if(user_session.ended_at) {
			return res.status(404).json({ msg: 'Session ended' })
		}
		return res.json({
			session: user_session,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			mobile: user.mobile,
			upi: user.upi,
			user_role: user.user_role,
			adhar: user.adhar,
			terms_conditions: user.terms_conditions,
			avatar: user.avatar,
		})
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

router.post(
	'/login/email',
	[
		body('email', 'Please include a valid email').isEmail(),
		body('password', 'Password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { email, password } = req.body

		try {
			let user = await User.findOne({ email })

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] })
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] })
			}

			const payload = {
				user: {
					id: user.id,
				},
			}
			let jwt_result = {}
			jwt.sign(
				payload,
				'my-jwt-secret',
				{ expiresIn: '4 hours' },
				async (err, token) => {
					if (err) {
						throw err
					}
					if (!user.sessions) {
						user.sessions = []
					}
					jwt_result['token'] = token
					user.sessions.push(jwt_result)
					user = await User.findOneAndUpdate(
						{ email },
						{ $set: user },
						{ new: true }
					)
					const user_session = user.sessions.sort((a,b)=>b.created_at-a.created_at)[0]
					await res.json({ ...jwt_result, session_id: user_session._id, first_name:user.first_name, last_name:user.last_name })
				}
			)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Server error')
		}
	}
)

router.post(
	'/organizations/login',
	auth,
	[
		body('org_id', 'Please include a valid organization_id').isEmail(),
		body('access_key', 'access_key is required').exists(),
		body('ip_address', 'Please include a valid ip_address').exists(),
		body('user_id', 'user_id is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { org_id, access_key, ip_address, user_id } = req.body
		
		try {
			let user = await User.findOne({ email: org_id })

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Organization Id Credentials' }] })
			}

			const isMatch = await bcrypt.compare(access_key, user.password)
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Org Credentials' }] })
			}

			user = await User.findOne({ email: user_id })
			const user_match = await bcrypt.compare(access_key, user.password)

			if (!user || !user_match) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid User Id Credentials' }] })
			}

			if (user._id.toString()!==req.user.id){
				return res
					.status(400)
					.json({ errors: [{ msg: 'Unauthorized Access!' }] })
			}

			const isMatchUser = await bcrypt.compare(access_key, user.password)
			if (!isMatchUser) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid User Credentials' }] })
			}

			const payload = {
				user: {
					id: user.id,
				},
			}
			let jwt_result = {}
			jwt.sign(
				payload,
				'my-jwt-secret',
				{ expiresIn: '4 hours' },
				async (err, token) => {
					if (err) {
						throw err
					}
					if (!user.sessions) {
						user.sessions = []
					}
					jwt_result['token'] = token
					user.sessions.push(jwt_result)
					user = await User.findOneAndUpdate(
						{ email:user_id },
						{ $set: user },
						{ new: true }
					)
					const user_session = user.sessions.sort((a,b)=>b.created_at-a.created_at)[0]
					await res.json({ ...jwt_result, session_id: user_session._id, first_name:user.first_name, last_name:user.last_name })
				}
			)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Server error')
		}
	}
)

router.post(
	'/logout',
	auth,
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		try {
			let user = await User.findById(req.user.id)
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] })
			}
			user.sessions = user.sessions.map((session) => {
				if(session._id === req.body.session_id) {
					session.ended_at = Date.now()
					return session
				}
				return session
			})
			user = await User.findOneAndUpdate(
				{ _id: req.user.id },
				{ $set: user },
				{ new: true }
			)
			
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Server error')
		}
	}
)

router.post(
	'/login/mobile',
	[
		body('mobile', 'Please include a valid mobile').isMobilePhone(),
		body('password', 'Password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { email, password } = req.body

		try {
			let user = await User.findOne({ email })

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] })
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Credentials' }] })
			}

			const payload = {
				user: {
					id: user.id,
				},
			}
			jwt.sign(
				payload,
				'my-jwt-secret',
				{ expiresIn: '5 days' },
				(err, token) => {
					if (err) {
						throw err
					}
					res.json({ token })
				}
			)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Server error')
		}
	}
)


router.post('/send-email-verification', async (req, res) => {
	const { email } = req.body;
	
	try {
	  // Using Twilio Verify service to generate OTP
	  let user = await User.findOne({ email })
			if (user) {
				return res
					.status(400)
					.json([{ msg: 'User already exists' }])
			}
	  const verification = await twilioClient.verify.v2
		.services(verifyServiceSid)
		.verifications
		.create({ to: email, channel: 'email' });
  
	  res.json({ success: true, sid: verification.sid });
	  return true
	} catch (error) {
	  res.status(500).json({ success: false, error: error.message });
	}
  });
  
router.post('/verify-email-otp', async (req, res) => {
	const { email, otp } = req.body;
	
	try {
	  // Verify the OTP using Twilio Verify service
	  const verificationCheck = await twilioClient.verify.v2
		.services(verifyServiceSid)
		.verificationChecks
		.create({ to: email, code:otp });
  
	  if (verificationCheck.status === 'approved') {
		res.json({ success: true, message: "OTP validated successfully!" });
		return true
	  } else {
		res.status(400).json({ success: false, error: "Invalid OTP" });
	  }
	} catch (error) {
	  res.status(500).json({ success: false, error: error.message });
	}
  });


router.post('/send-mobile-verification', async (req, res) => {
	const { mobile } = req.body;
	
	try {
	  // Using Twilio Verify service to generate OTP
	  let user = await User.findOne({ mobile })
			if (user) {
				return res
					.status(400)
					.json([{ msg: 'User already exists' }])
			}
	  const verification = await twilioClient.verify.v2
		.services(verifyServiceSid)
		.verifications
		.create({ to: mobile, channel: 'sms' });
  
	  res.json({ success: true, sid: verification.sid });
	  return true
	} catch (error) {
	  res.status(500).json({ success: false, error: error.message });
	}
  });

router.post('/verify-mobile-otp', async (req, res) => {
	const { mobile, otp } = req.body;
	
	try {
	  // Verify the OTP using Twilio Verify service
	  const verificationCheck = await twilioClient.verify.v2
		.services(verifyServiceSid)
		.verificationChecks
		.create({ to: mobile, code:otp });
  
	  if (verificationCheck.status === 'approved') {
		res.json({ success: true, message: "OTP validated successfully!" });
		return true
	  } else {
		res.status(400).json({ success: false, error: "Invalid OTP" });
	  }
	} catch (error) {
	  res.status(500).json({ success: false, error: error.message });
	}
  });

  router.post('/send-adhar-verification', async (req, res) => {
	const { adhar, consent } = req.body;
	
	try {
	  // Using Twilio Verify service to generate OTP
	  let user = await User.findOne({ adhar })
		if (user) {
				return res
					.status(400)
					.json([{ msg: 'User already exists' }])
			}
		const config = {
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': "key_live_Uq3nkkDORnjxl06HRnI42HzcAUgYXyBf",
					'x-api-secret': "secret_live_7aK9hE1sjKjyqkW3Bw3S8qA8EK0prkQN",
					'x-api-version': "2.0",
				},
			}
		let access_token_response = await axios.post('https://api.sandbox.co.in/authenticate', null,config)
		let send_otp_config = {
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': "key_live_Uq3nkkDORnjxl06HRnI42HzcAUgYXyBf",
				'x-api-version': "2.0",
				'Authorization': `${access_token_response.data.access_token}`
			}
		}
		let send_otp_response = await axios.post('https://api.sandbox.co.in/kyc/aadhaar/okyc/otp', {
			'@entity': 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
			"aadhaar_number": adhar,
			"consent": consent,
			"reason": "For KYC"
		},send_otp_config)
		res.json({ success: true, data: send_otp_response.data });
	} catch (error) {
	  console.log(error)
	  res.status(500).json({ success: false, error: error.message });
	}
  });

router.post('/verify-adhar-otp', async (req, res) => {
	const { reference_id, otp } = req.body;
	
	try {
	  // Verify the OTP using Twilio Verify service
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': "key_live_Uq3nkkDORnjxl06HRnI42HzcAUgYXyBf",
				'x-api-secret': "secret_live_7aK9hE1sjKjyqkW3Bw3S8qA8EK0prkQN",
				'x-api-version': "2.0",
			},
		}
	let access_token_response = await axios.post('https://api.sandbox.co.in/authenticate', null,config)
	let verify_otp_config = {
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': "key_live_Uq3nkkDORnjxl06HRnI42HzcAUgYXyBf",
			'x-api-version': "2.0",
			'Authorization': `${access_token_response.data.access_token}`
		}
	}
		let verify_otp_response = await axios.post('https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify', {
			"@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
			"reference_id": reference_id,
			"otp": otp
		},verify_otp_config)
		res.json({ success: true, data: verify_otp_response.data });
	} catch (error) {
	  console.log(error)
	  res.status(500).json({ success: false, error: error.message });
	}
  });

  router.post('/verify-upi', async (req, res) => {
	const { upi, name } = req.body;
	
	try {
	  // Verify the OTP using Twilio Verify service
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': "key_live_Uq3nkkDORnjxl06HRnI42HzcAUgYXyBf",
				'x-api-secret': "secret_live_7aK9hE1sjKjyqkW3Bw3S8qA8EK0prkQN",
				'x-api-version': "2.0",
			},
		}
	let access_token_response = await axios.post('https://api.sandbox.co.in/authenticate', null,config)
	let verify_upi = {
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': "key_live_Uq3nkkDORnjxl06HRnI42HzcAUgYXyBf",
			'x-api-version': "2.0",
			'Authorization': `${access_token_response.data.access_token}`
		}
	}
		let verify_upi_response = await axios.get(`https://api.sandbox.co.in/bank/upi/${upi}?name=${name}`,verify_upi)
		res.json({ success: true, data: verify_upi_response.data });
	} catch (error) {
	  console.log(error)
	  res.status(500).json({ success: false, error: error.message });
	}
  });

module.exports = router
