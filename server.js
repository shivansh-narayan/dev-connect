express = require( 'express')
const app = express()
const connectDB  = require('./config/db')
const PORT = process.env.PORT || 5000


connectDB()
app.get('/',(req,res)=> res.send('Runnign') )


//middleware

app.use(express.json({extnded:false}))

// define routes
app.use('/api/users',require('./api/users'))
app.use('/api/auth',require('./api/auth'))
app.use('/api/profile',require('./api/profile'))
app.use('/api/posts',require('./api/posts'))

app.listen(PORT , ()=> console.log(`Server Started on Port ${PORT}`));
