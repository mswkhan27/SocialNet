const express=require('express');

const request=require('request');
const config=require('config');

const router=express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult}=require('express-validator/check');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { response } = require('express');
// @route GET api/profile/mes
// @desc Get current users profile
//@access Private
router.get('/me',auth,async(req, res)=>{
    try{

        const profile=await Profile.findOne({user:req.user.id}).populate(
            'user',
            ['name','avatar']

        );
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
          }

          res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
          }
});

router.post(
    '/',
    auth,
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
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
        twitter,
        instagram,
        linkedin,
        facebook
        // spread the rest of the fields we don't need to check
      } = req.body;

      const profileFields={};
      profileFields.user=req.user.id;
      if (company)profileFields.company=company;
      if (website)profileFields.website=website;
      if (location)profileFields.location=location;
      if (bio)profileFields.bio=bio;
      if (status)profileFields.status=status;
      if (githubusername)profileFields.githubusername=githubusername;
      if (skills) {
          profileFields.skills=skills.split(',').map(skill=>skill.trim());
      }
      profileFields.social={};

      if (youtube)profileFields.social.youtube=youtube;
      if (twitter)profileFields.social.twitter=twitter;
      if (facebook)profileFields.social.facebook=facebook;
      if (linkedin)profileFields.social.linkedin=linkedin;
      if (instagram)profileFields.social.instagram=instagram;


      try{
          let profile =await Profile.findOne({user:req.user.id});

          if (profile){

            profile=await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set:profileFields},
                {new:true}

            );
            return res.json(profile);
          }
          profile = new Profile(profileFields);
          await profile.save();
          res.json(profile);

      }
      catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
      }

    }
);

router.get('/',async(req, res)=>{
    try{

        const profile=await Profile.find().populate(
            'user',
            ['name','avatar']
        );

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile.' });
          }

          res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
          }
});

router.get('/user/:user_id',async(req, res)=>{
    try{

        const profile=await Profile.find({user:req.params.user_id}).populate(
            'user',
            ['name','avatar']
        );

        if (!profile) {
            return res.status(400).json({ msg: 'Profile Not Found.' });
          }

          res.json(profile);
        } catch (err) {
            console.error(err.message);
            if(err.kind == 'ObjectId'){
                return res.status(400).json({msg:'Profile not found!'})
            }
            res.status(500).send('Server Error');
          }
});

//  @route DELETE api/profile
//  @desc Delete profile, user & posts
//  @access Private
router.delete('/',auth, async(req, res)=>{
    try{
        //Remove Profile
        await Profile.findOneAndRemove({user:req.user.id});
        //Remove User
        await User.findOneAndRemove({_id:req.user.id});
        console.log(req.user_id);
          res.json({msg:'User deleted.'});
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
          }
});

//  @route PUT api/profile/experience/:exp_id
//  @desc Add experience
//  @access Private
router.put('/experience',[auth,[
  check('title','Title is required.')
  .not().isEmpty(),
  check('company','Company is required.')
  .not().isEmpty(),
  check('from','From date is required.')
  .not().isEmpty()
]
],
   async(req, res)=>{

    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
    const{

      title,
      company,
      location,
      from,
      to,
      current,
      description
    }=req.body;

    const newExp={
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }
  try{
      //Remove Profile
      const profile=await Profile.findOne({user:req.user.id});
      //Remove User
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
});

//  @route DELETE api/profile/experience/:exp_id
//  @desc Delete experience
//  @access Private
router.delete('/experience/:exp_id',auth,async(req,res)=>{
  try{
  const profile =await Profile.findOne({user:req.user.id});
  //Get Remove Index

  const removeIndex=profile.experience
  .map(item=>item.id)
  .indexOf(req.params.exp_id);

  profile.experience.splice(removeIndex,1);
  await profile.save();
  res.json(profile);

}
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});



//  @route DELETE api/profile/education
//  @desc ADD education
//  @access Private
router.put('/education',[auth,[
  check('school','School is required.')
  .not().isEmpty(),
  check('degree','Degree is required.')
  .not().isEmpty(),
  check('from','From date is required.')
  .not().isEmpty()
]
],
   async(req, res)=>{

    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
    const{

      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }=req.body;

    const newEdu={
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }
  try{
      //Remove Profile
      const profile=await Profile.findOne({user:req.user.id});
      //Remove User
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
});

//  @route DELETE api/profile/education/:edu_id
//  @desc Delete education
//  @access Private
router.delete('/education/:edu_id',auth,async(req,res)=>{
  try{
  const profile =await Profile.findOne({user:req.user.id});

  //Get Remove Index
  const removeIndex=profile.education
  .map(item=>item.id)
  .indexOf(req.params.edu_id);

  profile.education.splice(removeIndex,1);
  await profile.save();
  res.json(profile);

}
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});





//  @route GET api/profile/github/:username
//  @desc GET user repos from github
//  @access Public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
      &client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecretId')}`,
      method:'GET',
      headers:{'user-agent':'node.js'}

    };

    request(options,(error,response,body) => {
      if (error) console.error(error);

      if (response.statusCode!==200){
        return res.status(404).json({msg:'No Github profile found.'});
      }
      res.json(JSON.parse(body));


  });

}
   catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});



module.exports=router;