import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactImageFallback from 'react-image-fallback';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import getPhoto from '../../utils/getPhoto';
import avatar from '../../img/avatar.png';
import spinner from '../layout/spinner.gif';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading }
}) => {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    let unmounted = false;
    getCurrentProfile();
    if (user) {
      getPhoto(user._id)
        .then((res) => {
          if (!unmounted) {
            setPhoto(res);
          }
        })
        .catch((err) => {
          if (!unmounted) {
            setPhoto(null);
          }
        });
      return () => {
        unmounted = true;
      };
    }
  }, [getCurrentProfile, loading]);

  return (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <ReactImageFallback
          src={photo}
          fallbackImage={avatar}
          initialImage={spinner}
          alt={photo}
          style={{
            verticalAlign: 'middle',
            width: '100px',
            height: '100px',
            marginRight: '30px',
            borderRadius: '50%'
          }}
        />
        {/* <i className="fas fa-user" />  */}
        Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />

          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
