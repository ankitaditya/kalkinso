const express = require('express')
const { body, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

// Assuming you have some method to generate OTP
const { generateOTP, verifyOTP } = require('../../utils/otpUtils');
const config = require('config')

const User = require('../../models/User')
const Profile = require('../../models/Profile')

const router = express.Router()

router.post(
	'/',
	[
		body('first_name', 'Name is required').not().isEmpty(),
		body('last_name', 'Name is required').not().isEmpty(),
		body('email', 'Please include a valid email').isEmail(),
		body('mobile', 'Please include a valid mobile number').isMobilePhone(),
		body('upi', 'Please include a valid UPI').not().isEmpty(),
		body('user_role', 'Please include a valid user_role').not().isEmpty(),
		body('adhar', 'Please include a valid last 4 digit of your Adhar number').not().isEmpty(),
		body('terms_conditions', 'Please accept the terms and conditions').not().isEmpty(),
		body(
			'password',
			'Please enter a password with 8 or more characters'
		).isLength({ min: 8 }),
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
					.status(400)
					.json([{ msg: 'User already exists' }])
			}

			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			})

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
				user_role:user_role,
				verification_status:{
					email:{
						value:email,
						isVerified:true
					},
					phone:{
						value:mobile,
						isVerified:true
					},
					pan:{
						value:adhar,
						isVerified:true
					},
					upi:{
						value:upi,
						isVerified:true
					},
					adhar:{
						value:adhar,
						isVerified:true
					}
				},
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
				'my-jwt-secret',
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

// Email OTP Send API
router.post('/send-email-otp', async (req, res) => {
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
router.post('/verify-email-otp', async (req, res) => {
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
