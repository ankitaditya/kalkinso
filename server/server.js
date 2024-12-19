require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet')
const jwt = require('jsonwebtoken')
var cors = require('cors')
const EventEmitter = require("events");
const NodeMediaServer = require('node-media-server');
const connectDB = require('../config/db');
const auth = require('../middleware/auth');


const app = express();
app.set("eventEmitter", new EventEmitter());
var allowlist = ['http://localhost', 'https://www.w3schools.com', 'http://localhost:5173', 'https://bucaudio.kalkinso.com', 'https://localhost', 'http://localhost:3000', 'https://kalkinso.com', 'http://kalkinso.com','https://bucaudio.com', 'https://www.bucaudio.com', 'https://tools.bucaudio.com',, 'https://www.kalkinso.com', 'http://www.kalkinso.com', 'http://mozilla.github.io','https://mozilla.github.io', 'https://i18n.ultrafast.io']
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
		const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET)
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
  // if(!req.hostname.includes('kalkinso.com')||!req.hostname.includes('localhost')){
  //   res.redirect('https://kalkinso.com'+req.path);
  //   res.end();
  //   helmet.frameguard({ action: 'deny' })(req, res, next);
  // }
  if (req.headers["user-agent"]?.includes("SuspiciousBot")) {
    res.status(403).send("Access Denied");
    return;
  }
  if (req.path.startsWith('/token=')||
      req.path.startsWith('/static')||
      req.path.startsWith('/3d/editor')||
      req.path.startsWith('/3d/examples')||
      req.path.startsWith('/3d/files')||
      req.path.startsWith('/episteme')||
      req.path.startsWith('/api')) {
    // Apply frameguard for this route
    // if(req.path.startsWith('/3d/editor')){
    //   auth(req, res, next)
    // }
    if(req.path.startsWith('/token=')&&!req.path.startsWith('/3d')&&!req.path.startsWith('/episteme')){
      if (allowlist.includes(req?.headers?.referer?.slice(0,-1))) {
        next()
      } else {
        helmet.frameguard({ action: 'deny' })(req, res, next);
      }
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
// app.use('/api/bucaudio', require('../routes/api/bucaudio'))
app.use('/api/payments', require('../routes/api/payments'))


app.use(express.static(path.join(__dirname, '../build')));

// app.use('/api/config', require('../routes/api/config'))
// app.get('/3d/editor', (req, res) => {
//   res.sendFile(path.join(__dirname, '../build/3d/editor', 'index.html'));
// })

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

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 8000,
    allow_origin: allowlist,
  },
};

const nms = new NodeMediaServer(config);
nms.run();

// var httpsServerOptions = {
//   'key': fs.readFileSync('./https/key.pem'),
//   'cert': fs.readFileSync('./https/cert.pem')
// };
// var httpsServer = https.createServer(httpsServerOptions, app);

// httpsServer.listen(port, function() {
//     console.info(`Server listening on https://kalkinso.com`);
// });
