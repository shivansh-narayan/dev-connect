const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,resp,next) {

    const token = req.header('x-auth-token')
    if(token==undefined) {

        return resp.status(401).json({msg : "no token sent"})
    }

        try {
            
            const decoded = jwt.verify(token,config.get('jwtSecret'))

            req.user = decoded.user;
            next()
        } catch (error) {
            console.log(error.message)
            resp.status(401).json({msg : "Invalid Token Sent"})
        }
    }
