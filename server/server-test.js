require('greenlock-express').create({
  // Let's Encrypt v2 is ACME draft 11
  version: 'draft-11'
, server: 'https://acme-v02.api.letsencrypt.org/directory'

  // You MUST change these to valid email and domains
, email: 'info@kalkinso.com'
, approveDomains: [ 'kalkinso.com', 'www.kalkinso.com' ]
, agreeTos: true

  // This should be the directory to which certificates are saved
, configDir: "../https/"

, app: require('./app.js')

, communityMember: true // Get notified of important updates
, telemetry: true       // Contribute telemetry data to the project
}).listen(80, 443);