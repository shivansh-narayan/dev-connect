const express = require('express')
router = express.Router()
const auth = require('../middleware/auth')
const Profile = require('../models/Profile')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
//@route /api/profile/me GET
//@acess Protected
router.get('/me', auth, async (req, res) => {



    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
        if (profile == undefined) {
            return res.status(400).send('There is no Profile for the user')
        }


    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }

})

//@route /api/prfile/me POST
//@acess Protected
router.post('/me', auth, [
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty()
], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    //bulild profile object

    const profileFields = {}

    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername

    if (skills) {
        profileFields.skills = skills.split(',').map(s => s.trim())
    }

    profileFields.social = {}

    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram
    try {

        let profile = await Profile.findOne({ user: req.user.id })
        if (profile) {
            //update
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, profileFields, { useFindAndModify: false, new: true })

            return res.json(profile)
        }
        else {
            //update
            profile = new Profile(profileFields);
            await profile.save()

            return res.json(profile)
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send('server error')
    }
})

//@route /api/profile/ GET
//@acess Pubilc

router.get('/', async (req, res) => {

    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('server error')
    }

})

//@route /api/profile/user_id GET
//@acess Pubilc

router.get('/user', async (req, res) => {

    try {
        const profiles = await Profile.find({ user: req.query.user_id }).populate('user', ['name', 'avatar']);
        if (profiles.length == 0)
            return res.status(400).send('No user with the given id')
        res.json(profiles)
    } catch (error) {
        if (error.kind === 'ObjectId')
            return res.status(400).send('No user with the given id')
        console.log(error.message)
        res.status(500).send('server error')
    }

})

//@route /api/profile/user_id Delete
//@acess Private

router.delete('/user', auth, async (req, res) => {

    try {
        await Profile.findOneAndDelete({ user: req.user.id });
        await User.findOneAndDelete({ _id: req.user.id });

        res.send('user and profiles are deleted')
    } catch (error) {
        if (error.kind === 'ObjectId')
            return res.status(400).send('No user with the given id')
        console.log(error.message)
        res.status(500).send('server error')
    }

})

//@route /api/profile/experience PUT
//@acess Private

router.put('/experience', auth,[
    check('title', 'title cannot be empty').not().isEmpty(),
    check('company', 'company cannot be empty').not().isEmpty(),
    check('from', 'from cannot be empty').not().isEmpty()
], async (req, res) => {

    const error = validationResult(req)
    if(!error.isEmpty()) {
        return res.status(400).json(error.array())
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body

        const newExp = {
            title : title,
            company:company,
            location:location,
            from:from,
            to:to,
            current:current,
            description:description
        }
        
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    } catch (error) {
        if (error.kind === 'ObjectId')
            return res.status(400).send('No user with the given id')
        console.log(error.message)
        res.status(500).send('server error')
    }

})

//@route /api/profile/experience Delete
//@acess Private

router.delete('/experience', auth, async (req, res) => {

    try {
        
        let exp_id = req.query.id
        
        let profile = await Profile.findOne({ user : req.user.id})
        let experience = profile.experience;
        let index = -1;
        for ( let i =0 ;i<experience.length;i++) {
            if(experience[i]._id == exp_id) {
                index = i;
                break;
            }
                
        }

        profile.experience.splice(index,1)
        await profile.save()

        return res.json(profile)


    } catch (error) {
        if (error.kind === 'ObjectId')
            return res.status(400).send('No user with the given id')
        console.log(error.message)
        res.status(500).send('server error')
    }

})

//@route /api/profile/experience PUT
//@acess Private

router.put('/experience', auth,[
    check('title', 'title cannot be empty').not().isEmpty(),
    check('company', 'company cannot be empty').not().isEmpty(),
    check('from', 'from cannot be empty').not().isEmpty()
], async (req, res) => {

    const error = validationResult(req)
    if(!error.isEmpty()) {
        return res.status(400).json(error.array())
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body

        const newExp = {
            title : title,
            company:company,
            location:location,
            from:from,
            to:to,
            current:current,
            description:description
        }
        
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    } catch (error) {
        if (error.kind === 'ObjectId')
            return res.status(400).send('No user with the given id')
        console.log(error.message)
        res.status(500).send('server error')
    }

})

//@route /api/profile/experience Delete
//@acess Private

router.delete('/experience', auth, async (req, res) => {

    try {
        
        let exp_id = req.query.id
        
        let profile = await Profile.findOne({ user : req.user.id})
        let experience = profile.experience;
        let index = -1;
        for ( let i =0 ;i<experience.length;i++) {
            if(experience[i]._id == exp_id) {
                index = i;
                break;
            }
                
        }

        profile.experience.splice(index,1)
        await profile.save()

        return res.json(profile)


    } catch (error) {
        if (error.kind === 'ObjectId')
            return res.status(400).send('No user with the given id')
        console.log(error.message)
        res.status(500).send('server error')
    }

})
module.exports = router