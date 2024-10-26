require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet')
const jwt = require('jsonwebtoken')
var cors = require('cors')

const connectDB = require('../config/db')

const app = express();
var allowlist = ['http://localhost', 'https://localhost', 'https://kalkinso.com', 'http://kalkinso.com', 'http://mozilla.github.io','https://mozilla.github.io', 'https://i18n.ultrafast.io']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(
  corsOptionsDelegate
))
const authVerify = (token) => {
  try {
		const decoded = jwt.verify(token, 'my-jwt-secret')
    console.log(token)
		return true
	} catch (err) {
		console.log('something wrong with auth middleware')
		return false
	}
}
// app.use(helmet({
//   frameguard: false // Disable frameguard globally
// }));

// Apply frameguard only to specific routes or conditions

app.use((req, res, next) => {
  // Example condition: apply frameguard only for certain routes
  // console.log(req.path.split('/')[1])
  if (req.path.startsWith('/token=')||req.path.startsWith('/static')||req.path.startsWith('/api')) {
    // Apply frameguard for this route
    if(req.path.startsWith('/token=')&&!authVerify(req.path.replace('/token=','').slice(0,-1))){
      helmet.frameguard({ action: 'deny' })(req, res, next);
    } else {
      // window.localStorage.setItem('token',req.path.split('/')[1].replace('token=',''))
      next(); // For other routes, continue without frameguard
    }
  } else {
    helmet.frameguard({ action: 'deny' })(req, res, next);
  }
});

connectDB()

app.use(express.json({ extended: false }))
app.use('/api/users', require('../routes/api/users'))
app.use('/api/auth', require('../routes/api/auth'))
app.use('/api/profile', require('../routes/api/profile'))
app.use('/api/chat-session', require('../routes/api/chat_sessions'))
app.use('/api/tasks', require('../routes/api/tasks'))
app.use('/api/kalkiai', require('../routes/api/kalkiai'))
app.use('/api/kits', require('../routes/api/kits'))
app.use('/api/how-to', require('../routes/api/how_to'))


app.use(express.static(path.join(__dirname, '../build')));

app.get('/health', function (req, res) {
  res.json({ status: 'UP' });
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = process.env.PORT ?? 80;
app.listen(port, function() {
    console.info(`Server listening on http://localhost:${port}`);
});

// var httpsServerOptions = {
//   'key': fs.readFileSync('./https/key.pem'),
//   'cert': fs.readFileSync('./https/cert.pem')
// };
// var httpsServer = https.createServer(httpsServerOptions, app);

// httpsServer.listen(port, function() {
//     console.info(`Server listening on https://kalkinso.com`);
// });
