const express = require('express');
const path = require('path');

const connectDB = require('./config/db')

const app = express();

connectDB()

app.use(express.json({ extended: false }))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

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
