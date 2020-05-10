const express = require('express')
router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
const CircularJSON = require('circular-json')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
//@route /api/auth GET
//@acess Private
router.get('/', auth, async (req, res) => {


    try {
        console.log(req.user.id)
        const user = await User.findById(req.user.id).select('-password')
        console.log(user)
        const str = CircularJSON.stringify(user);
        res.status('200').json(JSON.parse(str))
    } catch (error) {
        console.error(error.message)

        res.status(500).send('server error')
    }

})


//@route /api/auth POST
//@acess Public
router.post('/', [
    check('username', 'Enter a Valid Email').isEmail(),
    check('password', 'Field Cannot be blank').not().isEmpty()
], async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const { username, password } = req.body
        const user = await User.findOne({ email: username })

        if (user == undefined)
            return res.send('user is undefined')
        const check = await bcrypt.compare(password, user.password)

        if (!check) {
            return res.status(400).json({msg : 'Invalid Credentials'})
        }

        const payload = {
            user: {
                id : user.id
            }
        }

        const token = jwt.sign(payload,config.get('jwtSecret'),{expiresIn : 360000})
        return res.status(200).json(token)
        

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ msg: 'Server error' })
    }

    res.send('Login Route')
})


module.exports = router