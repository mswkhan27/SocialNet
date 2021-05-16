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

router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });



// @route GET api/users
// @desc Test route
//@access Public
router.post('/',[


  check('email','Please include valid email').isEmail(),
  check('password','Password is required').exists()
],

async(req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){

      return res.status(400).json({errors:errors.array()});
  }
  const {email,password}=req.body;

  try{
      let user=await User.findOne({email});
      if(!user){

          res.status(400).json({errors:[{msg:"Invalid Credentials"}]});
      }
      const isMatch= await  bcrypt.compare(password,user.password);
      console.log(user.password);
      if (!isMatch){
        return res.status(400).json({errors:[{msg:"Invalid Credentials2"}]});
      }
      

      const payload={

          user:{

              id:user.id
          }
      }
      jwt.sign(
          payload,
          config.get("jwtSecret"),
          {expiresIn:36000},
          (err,token)=>{
              if(err)throw err;
              res.json({token});
              }
          );
      //Encrypt Password
      //Return jsonwebtoken
  }
  catch(err){
      console.error(err.message);
      res.status(500).send("Server error");
  }


  console.log(req.body);

});




module.exports=router;