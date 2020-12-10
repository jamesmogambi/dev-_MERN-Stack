import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactImageFallback from 'react-image-fallback';
import config from '../../config.json';
import avatar from '../../img/avatar.png';
import spinner from '../layout/spinner.gif';

const API = config.SERVER_URL;

const ProfileItem = ({
  profile: {
    user: { _id, name, email },
    status,
    company,
    location,
    skills
  }
}) => {
  return (
    <div className="profile bg-light">
      <ReactImageFallback
        src={`${API}/profile/photo/${_id}`}
        fallbackImage={avatar}
        initialImage={spinner}
        alt={name}
        style={{
          verticalAlign: 'middle',
          width: '150px',
          height: '150px',
          borderRadius: '50%'
        }}
      />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className="my-1">{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className="text-primary">
            <i className="fas fa-check" /> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
