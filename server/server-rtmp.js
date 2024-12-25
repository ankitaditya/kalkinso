
const NodeMediaServer = require('node-media-server');

var allowlist = [ 'http://localhost:5173', 'https://www.kalkinso.org', 'https://bucaudio.kalkinso.com', 'https://kalkinso.com', 'http://kalkinso.com','https://bucaudio.com', 'https://www.bucaudio.com', 'https://tools.bucaudio.com',, 'https://www.kalkinso.com', 'http://www.kalkinso.com']

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