const express= require('express');
const router=express.Router();
const {check, validationResult}=require('express-validator/check');
const gravatar= require('gravatar');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require("../../models/User");
const config=require("config");

// @route GET api/users
// @desc Test route
//@access Public
router.post('/',[

    check('name','Name is required')
    .not()
    .isEmpty(),
    check('email','Please include valid email').isEmail(),
    check('password','Enter valid password').isLength({min:6})
],

async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){

        return res.status(400).json({errors:errors.array()});
    }
    const {name,email,password}=req.body;

    try{
        let user=await User.findOne({email});
        if(user){

            res.status(400).json({errors:[{msg:"User already exists"}]});
        }
        //Get users Gravatar
        const avatar=gravatar.url(email,{
            s:"200",
            r:"pg",
            d:"mm"
        });

        user=new User({
            name,
            email,
            avatar,
            password

        });
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        await user.save();

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