const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route GET api/users
// @desc Test routeY
//@access Public

router.get('/',auth, async(req,res)=>{

    try{
        const user=await User.findById(req.user.id).select('-password');
        console.log(user);
     }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports=router;