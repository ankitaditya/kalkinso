require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet')
const jwt = require('jsonwebtoken')
var cors = require('cors')
const child_process = require("child_process");
const AWS = require("aws-sdk");
const connectDB = require('../config/db');
const auth = require('../middleware/auth');

// Configure AWS SDK for S3
const s3 = new AWS.S3();
const bucketName = "live-kalkinso"; // S3 bucket name
const bucketRegion = "ap-south-1"; // Mumbai
let stopPlayback = true; // Flag to control playback
// Function to list all video files from the S3 bucket
async function getVideoFiles() {
  const params = {
    Bucket: bucketName,
  };

  const data = await s3.listObjectsV2(params).promise();
  return data.Contents.filter((file) =>
    file.Key.match(/\.(mp4|mkv|mov|avi|webm|flv)$/i)
  ).map((file) => file.Key);
}

// Function to stream a single video file to ffmpeg
async function streamVideo(fileKey, stream_key) {
  const url = `http://${bucketName}.s3-website.${bucketRegion}.amazonaws.com/${stream_key}/${fileKey.split('/').slice(-1)[0]}`;
  
  console.log(`Streaming file: ${encodeURI(url)}`);

  return new Promise((resolve, reject) => {
    // Spawn the FFmpeg process
    const ffmpeg = child_process.spawn("ffmpeg", [
      "-re",
      "-i",
      encodeURI(url),
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-f",
      "flv",
      "rtmp://rtmp.kalkinso.org/live/" + stream_key,
    ]);

    // Handle standard output
    ffmpeg.stdout.on("data", (data) => {
      if(stopPlayback){
        ffmpeg.kill('SIGKILL')
      }
      console.log(`FFmpeg stdout: ${data}`);
    });

    // Handle standard error
    ffmpeg.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    });

    // Handle process close event
    ffmpeg.on("close", (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      resolve();
    });

    // Handle process error event
    ffmpeg.on("error", (error) => {
      console.error(`Error starting FFmpeg process: ${error.message}`);
      reject(error);
    });
  });
}

// Main function to stream all videos in an infinite loop
async function streamAllVideos(stream_key) {
  while (!stopPlayback) {
    try {
      const videoFiles = await getVideoFiles();

      console.log(`Found ${videoFiles.length} video files in the bucket.`, videoFiles);

      if (!videoFiles.length) {
        console.log("No video files found in the bucket.");
        return;
      }

      for (const fileKey of videoFiles) {
        if (stopPlayback) {
          console.log("Playback stopped.");
          return;
        }
        await streamVideo(fileKey, stream_key);
      }

      console.log("Restarting video playback from the beginning...");
    } catch (error) {
      console.error("Error during video playback:", error);
    }
  }
}

const app = express();
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

// API endpoint to start playback
app.get("/stream/start", (req, res) => {
  const { stream_key } = req.query;
  if (stopPlayback) {
    stopPlayback = false;
    streamAllVideos(stream_key);
    res.send("Playback started.");
  } else {
    res.send("Playback is already running.");
  }
});

// API endpoint to stop playback
app.get("/stream/stop", async (req, res) => {
  stopPlayback = true;
  res.send("Playback stopped.");
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
