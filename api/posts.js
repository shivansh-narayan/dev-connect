const express = require('express')
router = express.Router()


//@route /api/users GET
//@acess Public
router.get('/',(req,reso)=> Response.send('posts route'))

module.exports = router