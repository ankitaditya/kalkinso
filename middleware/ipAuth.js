const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const helmet = require("helmet");
var allowlist = ['http://localhost', 'http://localhost:5173', 'https://bucaudio.kalkinso.com', 'https://localhost', 'http://localhost:3000', 'https://kalkinso.com', 'http://kalkinso.com', 'https://www.kalkinso.com', 'http://www.kalkinso.com', 'https://bucaudio.com', 'https://tools.bucaudio.com', 'https://www.bucaudio.com', 'http://mozilla.github.io','https://mozilla.github.io', 'https://i18n.ultrafast.io']

function checkAuth (req, res, next) {
  const token = req.header('x-auth-token')
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


module.exports = function (req, res, next) {
	if (req.headers['sec-fetch-site'] !== 'same-origin') {
        if (req.hostname.includes('kalkinso.com') || req.hostname.includes('localhost') || req.hostname.includes('bucaudio.com')) {
            next();
        } else {
          return res.status(404).send(`
            <!DOCTYPE html>
              <html lang="en">
              <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>404 - Page Not Found</title>
              <link rel="icon" href="/kalkinso-favicon.png"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
              <link rel="stylesheet" href="https://unpkg.com/@carbon/ibm-products/css/index.min.css">
              <link rel="stylesheet" href="https://unpkg.com/@carbon/ibm-products/css/themes/white/index.min.css">
              <style>
                  body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f4f4f4;
                  }
                  .container {
                  text-align: center;
                  padding: 2rem;
                  }
                  .container h1 {
                  font-size: 5rem;
                  color: #0043ce;
                  margin-bottom: 1rem;
                  }
                  .container p {
                  font-size: 1.25rem;
                  color: #525252;
                  margin-bottom: 2rem;
                  }
                  .container a {
                  text-decoration: none;
                  font-size: 1rem;
                  color: #ffffff;
                  background-color: #0043ce;
                  padding: 10px 20px;
                  border-radius: 4px;
                  transition: background-color 0.3s ease-in-out;
                  }
                  .container a:hover {
                  background-color: #002d9c;
                  }
              </style>
              </head>
              <body>
              <div class="container">
                  <h1>404</h1>
                  <p>We can’t find the page you’re looking for.</p>
                  <a href="/">Go Back to Home</a>
              </div>
              </body>
              </html>
          `);
        }
      } else {
        // Continue with the normal flow
        next();
      } 
}
