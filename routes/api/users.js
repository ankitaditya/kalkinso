const express = require('express')
const { body, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

// Assuming you have some method to generate OTP
const { generateOTP, verifyOTP } = require('../../utils/otpUtils');
const config = require('config')
const auth = require('../../middleware/auth')

const User = require('../../models/User')
const Profile = require('../../models/Profile')
const ipAuth = require('../../middleware/ipAuth')

const router = express.Router()

router.post(
	'/',
	ipAuth,
	[
		body('first_name', 'Name is required').not().isEmpty(),
		body('last_name', 'Name is required').not().isEmpty(),
		body('email', 'Please include a valid email').isEmail(),
		body('terms_conditions', 'Please accept the terms and conditions').not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { first_name, last_name, email, mobile, upi, user_role,adhar, terms_conditions, password } = req.body

		try {
			let user = await User.findOne({ email })
			if (user) {
				return res
					.status(403)
					.json([{ msg: 'User already exists' }])
			}

			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			})

			let verification_status = {}

			for (let key in req.body) {
				if(key === 'email' && email){
					verification_status[key] = {
						value:email,
						isVerified:true
					}
				} else if(key === 'phone' && mobile){
					verification_status[key] = {
						value:mobile,
						isVerified:true
					}
				} else if(key === 'pan' && adhar){
					verification_status[key] = {
						value:adhar,
						isVerified:true
					}
				} else if(key === 'upi' && upi){
					verification_status[key] = {
						value:upi,
						isVerified:true
					}
				} else if(key === 'adhar' && adhar){
					verification_status[key] = {
						value:adhar,
						isVerified:true
					}
				}
			}

			user = new User({
				first_name, 
				last_name, 
				email, 
				mobile,
				upi,
				adhar, 
				terms_conditions,
				avatar,
				password,
			})

			let profile = new Profile({
				user: user._id,
				first_name:first_name,
				last_name:last_name,
				username: `${first_name.toLocaleLowerCase()}.${last_name.toLocaleLowerCase()}${`${user._id}`.slice(-4)}`,
				user_role:user_role?user_role:'Explorer',
				verification_status,
			  isActive:true,
			})

			const salt = await bcrypt.genSalt(10)
			user.password = await bcrypt.hash(password, salt)

			await user.save()
			await profile.save()

			const payload = {
				user: {
					id: user.id,
				},
			}
			jwt.sign(
				payload,
				process.env.REACT_APP_JWT_SECRET,
				{ expiresIn: "2000" },
				(err, token) => {
					if (err) {
						throw err
					}
					res.json({ token })
				}
			)
		} catch (err) {
			const user = User.findOne({ email: email })
			if(user) {
				await User.findOneAndDelete({ email: email })
				await Profile.findOneAndDelete({ user: user.id })
			}
			if (err.message.includes('duplicate key error collection')) {
				let message = err.message.includes('email') ? 'email' : (err.message.includes('mobile') ? 'mobile' : 'upi')
				console.error(`ERROR: A user with same ${message} already exists!: -> `,err.message)
				return res.status(400).json([{ msg: `A user with same ${message} already exists!` }])
			} else{
				res.status(500).json([{ msg: err.message }])
			}
		}
	}
)

router.post(
	'/reset-password',
	auth,
	ipAuth,
	[
		body(
			'password',
			'Please enter a password with 8 or more characters'
		).isLength({ min: 8 }),
		body(
			'password2',
			'Please enter a password with 8 or more characters'
		).isLength({ min: 8 }),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { password, password2 } = req.body

		if (password !== password2) {
			return res
				.status(400)
				.json([{ msg: 'Passwords do not match' }])
		}

		try {
			const user = await User.findById(req.user.id);
			if (!user) {
				return res
					.status(400)
					.json([{ msg: 'User not found' }])
			}
			const salt = await bcrypt.genSalt(10)
			user.password = await bcrypt.hash(password, salt)
			await user.save()
			res.json({ msg: 'Password updated successfully' })
		} catch (err) {
			console.error(err.message)
			res.status(500).json([{ msg: err.message }])
		}
	}
)

router.post(
	'/organizations/add',
	auth,
	ipAuth,
	[
		body('org_id', 'Org Id is required').isEmail(),
		body('ip_address', 'IP ADDRESS is required').not().isEmpty(),
		body('user_id', 'Please include a valid user_id').isEmail(),
		body('access_key', 'Please include a valid access_key').not().isEmpty(),
		body('upi', 'Please include a valid UPI').not().isEmpty(),
		body('adhar', 'Please include a valid last 4 digit of your Adhar number').not().isEmpty(),
		body('mobile', 'Please include a valid mobile number').not().isEmpty(),
		body('first_name', 'Name is required').not().isEmpty(),
		body('last_name', 'Name is required').not().isEmpty(),
		body('user_role', 'Please include a valid user_role').not().isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		const { org_id, ip_address, first_name, last_name, user_id, mobile, user_role, upi, adhar, access_key } = req.body;
		const org_user = await User.findOne({ email: org_id })
		const check_password = await bcrypt.compare(access_key, org_user.password)
		if (!org_user||!check_password) {
			return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid Organization Id Credentials' }] })
		}
		const isMatched = org_user._id.toString() === req.user.id
		console.log('isMatched:', isMatched, org_user._id.toString(), "===" ,req.user.id)
		if (!isMatched) {
			return res
					.status(400)
					.json({ errors: [{ msg: 'Unauthorized Access!' }] })
		}
		
		try {
			let user = await User.findOne({ email: user_id })
			if (user) {
				return res
					.status(400)
					.json([{ msg: 'User already exists' }])
			}

			const avatar = gravatar.url(user_id, {
				s: '200',
				r: 'pg',
				d: 'mm',
			})

			user = new User({
				first_name:first_name, 
				last_name:last_name, 
				email:user_id, 
				mobile:mobile,
				terms_conditions: org_user.terms_conditions,
				avatar: avatar,
				password: org_user.password,
				upi: upi,
				adhar: adhar,
			})

			let profile = new Profile({
				user: user._id,
				first_name:first_name, 
				last_name:last_name, 
				user_role:user_role,
				username: `${first_name.toLocaleLowerCase()}.${last_name.toLocaleLowerCase()}${`${user._id}`.slice(-4)}`,
				verification_status:{
					email:{
						value:user_id,
						isVerified:true
					},
					phone:{
						value:org_user.mobile,
						isVerified:true
					},
					pan:{
						value:adhar,
						isVerified:true
					},
					upi:{
						value: upi,
						isVerified:true
					},
					adhar:{
						value:adhar,
						isVerified:true
					}
				},
			  isActive:true,
			})

			// const salt = await bcrypt.genSalt(10)
			// user.password = await bcrypt.hash(password, salt)

			await user.save()
			await profile.save()

			const payload = {
				user: {
					id: user.id,
				},
			}
			jwt.sign(
				payload,
				process.env.REACT_APP_JWT_SECRET,
				{ expiresIn: "4 hours" },
				(err, token) => {
					if (err) {
						throw err
					}
					res.json({ token })
				}
			)
		} catch (err) {
			const user = User.findOne({ email: user_id })
			if(user) {
				await User.findOneAndDelete({ email: user_id })
				await Profile.findOneAndDelete({ user: user.id })
			}
			if (err.message.includes('duplicate key error collection')) {
				let message = err.message.includes('email') ? 'email' : (err.message.includes('mobile') ? 'mobile' : ( err.message.includes('adhar')?'adhar':'upi'))
				console.error(`ERROR: A user with same ${message} already exists!: -> `,err.message)
				console.error(err)
				return res.status(400).json([{ msg: `A user with same ${message} already exists!` }])
			} else{
				res.status(500).json([{ msg: err.message }])
			}
		}
	}
)

// Email OTP Send API
router.post('/send-email-otp', ipAuth, async (req, res) => {
    const { email } = req.body;
    try {
        const otp = generateOTP();
        // Store OTP in your database associated with the email
        // For simplicity, assuming you have a method to do so
        await User.updateOne({ email }, { $set: { emailOtp: otp } });

        // Send OTP via email (simplified)
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-password',
            },
        });

        let mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Verify your email',
            text: `Your OTP is: ${otp}`,
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return res.status(500).json({ msg: 'Failed to send email' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({ msg: 'OTP sent to email' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Email OTP Verify API
router.post('/verify-email-otp', ipAuth, async (req, res) => {
    const { email, otp } = req.body;
    try {
        // Retrieve the OTP stored in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Verify the OTP
        const isMatch = await verifyOTP(user.emailOtp, otp);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }

        // Proceed with user verification logic
        // For example, update the user's email verification status
        await User.updateOne({ email }, { $set: { isEmailVerified: true } });

        res.json({ msg: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
