const mongoose = require('mongoose')
const config = require('config')

const db = 'mongodb+srv://dbUser:photosoto@cluster0.g8dz9qi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
	try {
		await mongoose.connect(db)
		console.log('mongodb connected')
	} catch (err) {
		console.error(err.message)
		process.exit(1)
	}
}

module.exports = connectDB
