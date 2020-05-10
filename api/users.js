const express = require('express')
router = express.Router()
const { check, validationResult } = require('express-validator');
const User = require('../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jsonwebtocken = require('jsonwebtoken')
const config = require('config')

//@route /api/users POST
//@desc Register user
//@acess Public
router.post('/',
    [
        check('name', 'name is required').not().isEmpty(),
        check('email', 'email is required').isEmail(),
        check('password', 'password of min length 6 is required').isLength({ min: 6 })
    ],
    async (req, reso) => {
        console.log(req.body)
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return reso.status(400).json({ errors: error.array() })
        }

        const { name, email, password } = req.body;

        try {

            let user = await User.findOne({ email });

            if (user) {
                return reso.status(400).json({ "error": [{ msg: 'User already exists' }] })
            }

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)

            await user.save();


            const payload = {
                user: {
                    id: user.id
                }
            }
            jsonwebtocken.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
                if (err)
                    throw err;
                else {
                    console.log('no error in toekn generation')
                    reso.json({ token });
                }
            })
        } catch (error) {
            console.error(error.message)
            reso.status(500).send('Server Error')
        }



        
    })

module.exports = router