const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');
const formidable = require('formidable');
const fs = require('fs');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  // console.log('/me',req)
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    })
    .select('-photo')
    // .populate('user', ['name','email' ]);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server Error' });

    // res.status(500).send('Server Error');
  }
});


// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  auth,
    (req, res) => {

      let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      console.log('req user',req.user);

      console.log('fields',fields);
      console.log('files',files);

      console.log('usere id',req.user.id);

       if (err) {
      return res.status(400).json({
          msg: 'Image could not be uploaded'
      })};
    // destructure the request
    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      status,
      user,
      
      // spread the rest of the fields we don't need to check
      ...rest
    } = fields;
// check for required 
if ( !status ) {
  return res.status(400).json({ errors: [{ msg: 'Status is required.' }] });
 
}

if ( !skills ) {
  return res.status(400).json({ errors: [{ msg: 'Skills is required.' }] });
}

        // build a profile
    let profileFields = {
      user: req.user.id,
      website:
        website && website !== ''
          ? normalize(website, { forceHttps: true })
          : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => ' ' + skill.trim()) ,
        // photo:{
        //   data:null,
        //   contentType : null
        // },
        status,

      ...rest
    };
    console.log('skills',profileFields.skills);

    
        // Build socialFields object
    const socialFields = { youtube, twitter, instagram, linkedin, facebook };

    // normalize social fields to ensure valid url
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true });
    }
    // add to profileFields
    profileFields.social = socialFields;

    // console.log('socialFields',socialFields);
    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 1000000) {
  return res.status(400).json({ errors: [{ msg: 'Image should be less than 1mb in size.' }] });
          
      }
      
       profileFields = {
         ...profileFields,
         photo:{
          data:fs.readFileSync(files.photo.path),
          contentType : files.photo.type
        },
       }
      // profileFields.photo.data = fs.readFileSync(files.photo.path);
      // profileFields.photo.contentType = files.photo.type;
  }
   
  
  console.log('profileFields',profileFields);
  //  Profile.findOneAndUpdate(query, update, options)
  // Using upsert option (creates new doc if no match is found):
  Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
   
    )
    .then(profile => {
      if(profile) {
        console.log(`Successfully updated document: ${profile}.`)
        return res.json(profile);
      } else {
        console.log("No document matches the provided query.")
        // return res.status(500).send(`No document matches the provided query.`);
        // return res.status(500).send('Server Error');
  return res.status(500).json({ errors: [{ msg: 'Server Error' }] });

      }
      // return profile
    })
    .catch(err => {
      console.error(`Failed to find and update document: ${err}`)
      return res.status(500).send('Server Error');

    }
      )
        
  });
  
  }
);

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
// router.post(
//   '/',
//   auth,
//   check('status', 'Status is required').not().isEmpty(),
//   check('skills', 'Skills is required').not().isEmpty(),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     // destructure the request
//     const {
//       website,
//       skills,
//       youtube,
//       twitter,
//       instagram,
//       linkedin,
//       facebook,
//       // spread the rest of the fields we don't need to check
//       ...rest
//     } = req.body;

//     // build a profile
//     const profileFields = {
//       user: req.user.id,
//       website:
//         website && website !== ''
//           ? normalize(website, { forceHttps: true })
//           : '',
//       skills: Array.isArray(skills)
//         ? skills
//         : skills.split(',').map((skill) => ' ' + skill.trim()),
//       ...rest
//     };

//     // Build socialFields object
//     const socialFields = { youtube, twitter, instagram, linkedin, facebook };

//     // normalize social fields to ensure valid url
//     for (const [key, value] of Object.entries(socialFields)) {
//       if (value && value.length > 0)
//         socialFields[key] = normalize(value, { forceHttps: true });
//     }
//     // add to profileFields
//     profileFields.social = socialFields;
   
//     try {
//       // Using upsert option (creates new doc if no match is found):
//       let profile = await Profile.findOneAndUpdate(
//         { user: req.user.id },
//         { $set: profileFields },
//         { new: true, upsert: true, setDefaultsOnInsert: true }
//       );
//       return res.json(profile);
//     } catch (err) {
//       console.error(err.message);
//       return res.status(500).send('Server Error');
//     }
//   }
// );

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {

    const profiles = await Profile.find()
    .select('-photo')
    .populate('user', ['name', 'email']);
    // const profiles = await Profile.find().populate('user', ['name', 'photo']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  async ({ params: { user_id } }, res) => {
    try {
      const profile = await Profile.findOne({
        user: user_id
      }).select('-photo').populate('user', ['name', 'photo']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );
    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});

router.param("userId",(req, res, next, id) => {
  Profile.findOne({
    user: id
  }).populate('user', ['name'])
      .exec((err, user) => {
          if (err || !user) {
              return res.status(400).json({
                  error: 'User not found'
              });
          }
          // console.log('user from param,,',user)
          req.userProfile = user;
          next();
      });
});

// @route    GET api/profile/photo/:userId
// @desc     Send user photo
// @access   Private
router.get('/photo/:userId', (req, res, next) => {
  if (req.userProfile.photo.data) {
      res.set('Content-Type', req.userProfile.photo.contentType);
      return res.send(req.userProfile.photo.data);
  }
  next();
}
);
module.exports = router;
