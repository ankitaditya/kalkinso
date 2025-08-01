const mongoose = require('mongoose')
const config = require('config')

const db = `mongodb+srv://dbUser:photosoto@cluster0.g8dz9qi.mongodb.net/bucaudio?retryWrites=true&w=majority&appName=Cluster0`;

const getConnection = () => {
	try {
		return mongoose.createConnection(db)
	} catch (err) {
		console.error(err.message)
		process.exit(1)
	}
}

module.exports = getConnection
