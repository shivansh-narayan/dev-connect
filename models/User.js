const moongoose = require('mongoose')

const UserSchema = new  moongoose.Schema({
    name: {
        type : String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    avatar : {
        type : String
    },
    date : {
        type : Date,
        default: Date.now
    }

})

module.exports = User = moongoose.model('user',UserSchema);