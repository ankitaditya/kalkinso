require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet')
const jwt = require('jsonwebtoken')
var cors = require('cors')
const EventEmitter = require("events");
const connectDB = require('../config/db');
const auth = require('../middleware/auth');


const app = express();
app.set("eventEmitter", new EventEmitter());
var allowlist = ['http://localhost', 'http://localhost:5173', 'https://localhost', 'https://localhost:3000', 'https://kalkinso.com', 'http://kalkinso.com', 'https://www.kalkinso.com', 'http://www.kalkinso.com', 'http://mozilla.github.io','https://mozilla.github.io', 'https://i18n.ultrafast.io']
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
    if(req.path.startsWith('/token=')&&!authVerify(req.path.replace('/token=','').slice(0,-1))&&!req.path.startsWith('/3d')&&!req.path.startsWith('/episteme')){

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
app.use('/api/bucaudio', require('../routes/api/bucaudio'))


app.use(express.static(path.join(__dirname, '../build')));

app.get("/api/progress", (req, res) => {
  const eventEmitter = req.app.get("eventEmitter");

  const onProgress = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send headers for Server-Sent Events (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  eventEmitter.on("uploadProgress", onProgress);

  req.on("close", () => {
    eventEmitter.removeListener("uploadProgress", onProgress);
    res.end();
  });
});

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

// var httpsServerOptions = {
//   'key': fs.readFileSync('./https/key.pem'),
//   'cert': fs.readFileSync('./https/cert.pem')
// };
// var httpsServer = https.createServer(httpsServerOptions, app);

// httpsServer.listen(port, function() {
//     console.info(`Server listening on https://kalkinso.com`);
// });
