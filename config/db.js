const mongoose = require('mongoose')
const config = require('config')

const dbURI = config.get('mongoURI');

const connectDB = async () => {

    try {
        mongoose.connect(dbURI, ({
            useNewUrlParser: true,
            useUnifiedTopology: true
        }))
        console.log('Database is connected')
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB