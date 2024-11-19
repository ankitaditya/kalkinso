const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const helmet = require("helmet");

module.exports = function (req, res, next) {
	if (req.headers['sec-fetch-site'] !== 'same-origin') {
        res.status(404).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 Not Found</title>
            <style>
              body {
                margin: 0;
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: #f8f9fa;
                color: #333;
                text-align: center;
              }
              .container {
                max-width: 600px;
              }
              h1 {
                font-size: 6rem;
                margin: 0;
                color: #333333;
              }
              p {
                font-size: 1.25rem;
                margin: 10px 0 20px;
              }
              a {
                text-decoration: none;
                color: white;
                background: #333333;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 1rem;
                transition: background 0.3s;
              }
              a:hover {
                background: #161616;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>404</h1>
              <p>Oops! The page you're looking for doesn't exist.</p>
              <a href="/">Go Back Home</a>
            </div>
          </body>
          </html>
        `);
      } else {
        // Continue with the normal flow
        next();
      }
      
}
