const express=require('express');

const request=require('request');
const config=require('config');

const auth = require('../../middleware/auth');
const {check, validationResult}=require('express-validator/check');
const Profile = require('../../models/Post');
const User = require('../../models/User');
const router=express.Router();

// @route GET api/users
// @desc Test route
//@access Private
router.get('/',(req,res)=>res.send('Posts Running'));
module.exports=router;