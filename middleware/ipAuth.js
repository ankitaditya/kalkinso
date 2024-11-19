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
            <title>404 - Page Not Found</title>
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
      } else {
        // Continue with the normal flow
        next();
      }
      
}
