
const NodeMediaServer = require('node-media-server');

var allowlist = ['http://localhost', 'https://www.w3schools.com', 'http://localhost:5173', 'https://bucaudio.kalkinso.com', 'https://localhost', 'http://localhost:3000', 'https://kalkinso.com', 'http://kalkinso.com','https://bucaudio.com', 'https://www.bucaudio.com', 'https://tools.bucaudio.com',, 'https://www.kalkinso.com', 'http://www.kalkinso.com', 'http://mozilla.github.io','https://mozilla.github.io', 'https://i18n.ultrafast.io']

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