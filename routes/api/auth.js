require('dotenv').config();
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const twilio = require('twilio');
const { body, validationResult } = require('express-validator')
const axios = require('axios')
const auth = require('../../middleware/auth')

const User = require('../../models/User');
const ipAuth = require('../../middleware/ipAuth');
const AWS = require('aws-sdk');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const router = express.Router()
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const verifyServiceSid = process.env.TWILIO_SERVICE_SID;

router.get('/', ipAuth, auth, async (req, res) => {
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

router.get('/keep-alive', ipAuth, auth, async (req, res) => {
	try {
		let user = await User.findById(req?.user?.id).select('-password')
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
		const payload = {
			user: {
				id: user._id,
			},
		}
		let jwt_result = {}
		jwt.sign(
			payload,
			process.env.REACT_APP_JWT_SECRET,
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
					{ email:user.email },
					{ $set: user },
					{ new: true }
				)
				const user_session = user.sessions.sort((a,b)=>b.created_at-a.created_at)[0]
				res.json({ ...jwt_result, session_id: user_session._id, first_name:user.first_name, last_name:user.last_name })
			}
		)
	} catch (err) {
		console.error(err)
		res.status(400).send(err.message)
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
				process.env.REACT_APP_JWT_SECRET,
				{ expiresIn: '365 days' },
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
			let org_user = await User.findOne({ email: org_id })

			if (!org_user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Organization Id Credentials' }] })
			}

			const isMatch = await bcrypt.compare(access_key, org_user.password)
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Org Credentials' }] })
			}

			let user = await User.findOne({ email: user_id })
			const user_match = await bcrypt.compare(access_key, user.password)

			if (!user || !user_match) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid User Id Credentials' }] })
			}

			if (org_user._id.toString()!==req.user.id){
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
				process.env.REACT_APP_JWT_SECRET,
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
				process.env.REACT_APP_JWT_SECRET,
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


router.post('/send-email-verification', ipAuth, async (req, res) => {
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

  router.post('/send-login-email-verification', ipAuth, async (req, res) => {
	const { email } = req.body;
	
	try {
	  // Using Twilio Verify service to generate OTP
	  const user = await User.findOne({email:email})
		if (!user) {
			return res
				.status(404)
				.json({ errors: [{ msg: 'User not found!' }] })

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
  
router.post('/verify-email-otp', ipAuth, async (req, res) => {
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

  router.post('/verify-login-email-otp', ipAuth, async (req, res) => {
	const { email, otp } = req.body;
	
	try {
	  // Verify the OTP using Twilio Verify service
	  const verificationCheck = await twilioClient.verify.v2
		.services(verifyServiceSid)
		.verificationChecks
		.create({ to: email, code:otp });
		
	  if (verificationCheck.status === 'approved') {
		const user = await User.findOne({email:email});
		if (!user) {
			return res
				.status(403)
				.json({ errors: [{ msg: 'Unauthorized Access!' }] })
		}
		const payload = {
			user: {
				id: user._id,
			},
		}
		let jwt_result = {}
		const token = jwt.sign(
			payload,
			process.env.REACT_APP_JWT_SECRET,
			{ expiresIn: '4 hours' },
		)
		if (!user.sessions) {
			user.sessions = []
		}
		jwt_result['token'] = token
		user.sessions.push(jwt_result)
		await User.findOneAndUpdate(
			{ email: email },
			{ $set: user },
			{ new: true }
		)
		res.json({ success: true, message: "OTP validated successfully!", token: token });
		return true
	  } else {
		res.status(400).json({ success: false, error: "Invalid OTP" });
	  }
	} catch (error) {
	  res.status(500).json({ success: false, error: error.message });
	}
  });


router.post('/send-mobile-verification', ipAuth, async (req, res) => {
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

  router.post('/send-login-mobile-verification', ipAuth, async (req, res) => {
	const { mobile } = req.body;
	
	try {
	  // Using Twilio Verify service to generate OTP
	  const user = await User.findOne({mobile:mobile})
		if (!user) {
			return res
				.status(404)
				.json({ errors: [{ msg: 'User not found!' }] })

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

  router.post('/verify-mobile-otp', ipAuth, async (req, res) => {
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

  router.post('/verify-login-mobile-otp', ipAuth, async (req, res) => {
	const { mobile, otp } = req.body;
	
	try {
	  // Verify the OTP using Twilio Verify service
	  const verificationCheck = await twilioClient.verify.v2
		.services(verifyServiceSid)
		.verificationChecks
		.create({ to: mobile, code:otp });
  
	  if (verificationCheck.status === 'approved') {
		const user = await User.findOne({mobile:mobile});
		if (!user) {
			return res
				.status(403)
				.json({ errors: [{ msg: 'Unauthorized Access!' }] })
		}
		const payload = {
			user: {
				id: user._id,
			},
		}
		let jwt_result = {}
		const token = jwt.sign(
			payload,
			process.env.REACT_APP_JWT_SECRET,
			{ expiresIn: '4 hours' },
		)
		if (!user.sessions) {
			user.sessions = []
		}
		jwt_result['token'] = token
		user.sessions.push(jwt_result)
		await User.findOneAndUpdate(
			{ mobile: mobile },
			{ $set: user },
			{ new: true }
		)
		res.json({ success: true, message: "OTP validated successfully!", token: token });
		return true
	  } else {
		res.status(400).json({ success: false, error: "Invalid OTP" });
	  }
	} catch (error) {
	  res.status(500).json({ success: false, error: error.message });
	}
  });

  router.post('/send-adhar-verification', ipAuth, async (req, res) => {
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

router.post('/verify-adhar-otp', ipAuth, async (req, res) => {
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

  router.post('/verify-upi', ipAuth, async (req, res) => {
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

  router.post('/get-signed-url', ipAuth, auth, async (req, res) => {
	const { params, operation } = req.body;
	const client = new S3Client({region:'ap-south-1'});
	const get_command = new GetObjectCommand({
		Bucket: params.Bucket,
		Key: params.Key,
	});
	const put_command = new PutObjectCommand({
		Bucket: params.Bucket,
		Key: params.Key,
		Body: params.Body,
	});
	try {
		if(operation==='getObject'){
			const url = await getSignedUrl(client, get_command, { expiresIn: params.Expires });
			res.json({ success: true, url });
			return true
		} else if(operation==='putObject'){
			const url = await getSignedUrl(client, put_command, { expiresIn: params.Expires });
			res.json({ success: true, url });
			return true
		} else {
			res.status(400).json({ success: false, error: "Invalid Operation" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: error.message });
	}
  });

module.exports = router
