import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactImageFallback from "react-image-fallback";
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile  } from '../../actions/profile';
import config from '../../config.json';
import avatar from '../../img/avatar.png';

const API = config.backendURL;


let initialState = {
  photo:null,
  photoURL:null,
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  githubusername: '',
  bio: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  instagram: '',
  formData:new FormData()
};

const ProfileForm = ({
  profile: { profile, loading},
  createProfile,
  getCurrentProfile,
  getphoto,
  history
}) => {
  // const {photo,status,company,website,location,skills,repos,social} = profile;
  const [values, setValues] = useState(initialState);

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const {
    photo,
    photoURL,
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram,
    formData
  } = values;
  
  useEffect(() => {
    // setValues({ ...values, formData: new FormData() });
    if (!profile) getCurrentProfile() ;
    if (!loading && profile) {
      // getphoto(profile.user)
      console.log(profile);
             
      let avatar = `${API}/profile/photo/${profile.user}`;
      
      // setValues({ ...values, photoURL: avatar });

      const profileData = { ...initialState };
      profileData.photoURL = avatar;

      for (const key in profile ) { 
        if (key in profileData ) profileData[key] = profile[key];
        if (key !== 'photo' && key !== 'user' && key !== 'education' && key !== 'experience') {
          profileData.formData.set(key, profile[key]);

          // console.log(key,profile[key])
          
        }

           }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
        // profileData.formData.set(key, profile.social[key]);

      }
      if (Array.isArray(profileData.skills)){
            profileData.skills = profileData.skills.join(', ');
        profileData.formData.set('skills', profileData.skills);
      }

      // profileData.photoURL = imgUrl;

      setValues(profileData);
      console.log('profileData',profileData)
    }
    // console.log('state',values);

  }, [loading, getCurrentProfile, profile ]);

  // useEffect(() => {
  //   setValues({ ...values, formData: new FormData() });

  //   if (!profile) getCurrentProfile();
  //   if (!loading && profile) {
  //     console.log(`${API}/profile/photo/${profile.user._id}`);
  //   setValues({ ...values, photoURL:`${API}/profile/photo/${profile.user}` });

  //     console.log('profile',profile)
  //     const profileData = { ...initialState };
  //     profileData.formData = new FormData();
  //     for (const key in profile) {
  //       if (key in profileData) profileData[key] = profile[key];
  //       profileData.formData.set(key, profile[key]);
  //     // console.log('key',key);
  //     // console.log('value',profile[key]);

  //     }
  //     for (const key in profile.social) {
  //       if (key in profileData) profileData[key] = profile.social[key];
  //       profileData.formData.set(key, profile.social[key]);

  //     }
  //     if (Array.isArray(profileData.skills))
  //       profileData.skills = profileData.skills.join(', ');
  //       profileData.formData.set('skills', profileData.skills);
  //       // profileData.formData = profileData;
  //       // profileData.formData = new FormData();
  //       // profileData.formData.set('photo', profile.photo);
  //       profileData.formData.set('user', profileData.user);

  //       // profileData.photoURL = `${API}/profile/photo/${profile.user._id}` ;

  //     setValues(profileData);
  //     // setValues({...values,profileData});
  //   // setValues({ ...values, formData: new FormData() });

  //     console.log('profileData',profileData)
  //     console.log('state',values);
  //   }
  //   // setValues({ ...values, formData: new FormData() });

  // }, [loading, getCurrentProfile, profile]);

  //   const {
  //   photo,
  //   company,
  //   website,
  //   location,
  //   status,
  //   skills,
  //   githubusername,
  //   bio,
  //   twitter,
  //   facebook,
  //   linkedin,
  //   youtube,
  //   instagram,
  //   formData
  // } = values;

  const onChange = e => {

    if (e.target.name === 'photo') {
      formData.set(e.target.name, e.target.files[0] );
      
      setValues({ ...values,
        [e.target.name]: e.target.files[0] ,
        photoURL:URL.createObjectURL(e.target.files[0])
          });

            } else {
      formData.set(e.target.name, e.target.value);
      setValues({ ...values, [e.target.name]: e.target.value });
    }
   
};

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, profile ? true : false);
  };
  console.log('photoUrl',photoURL);
 console.log('values', values);

  return (
    <Fragment>
      <h1 className="large text-primary">Edit Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user" /> Add some changes to your profile
      </p>
            <form className="form" onSubmit={onSubmit}>
            <div className="form-group preview">
                    <ReactImageFallback
                    src={photoURL}
                    fallbackImage={avatar}
                    initialImage={avatar}
                    alt='hello'
                    style={{
                      verticalAlign: 'middle',
                      width: '170px',
                      height: '170px',
                      borderRadius: '50%'
                      
                      }}
                     />
                </div>
                <p> Change/Upload Profile Picture</p>

                <label className="btn btn-secondary">
                <input onChange={onChange} type="file" name="photo" accept="image/*" />
                </label>
            {/* <button
            onClick={() => onRemoveFile()}
            type="button"
            className="btn btn-light"
          >
            Remove Photo  <i className="fa fa-times" aria-hidden="true"></i>
          </button> */}
{/* 
      <photo
          height={200}
          width={200}
          // onCrop={onCrop}
          // onClose={onClose}
          src={photo}
          onFileLoad={onFileLoad}
        /> */}
             <div className="form-group">
        <small>* = required field</small>

          <select name="status" value={status} onChange={onChange}>
            <option>* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={company}
            onChange={onChange}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={onChange}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange}
          />
          <small className="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={skills}
            onChange={onChange}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={onChange}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={onChange}
          />
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type="button"
            className="btn btn-light"
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x" />
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={onChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x" />
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={onChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x" />
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={onChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x" />
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                value={linkedin}
                onChange={onChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x" />
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={onChange}
              />
            </div>
          </Fragment>
        )}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  ProfileForm
);