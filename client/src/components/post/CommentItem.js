import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactImageFallback from 'react-image-fallback';
import getPhoto from '../../utils/getPhoto';
import formatDate from '../../utils/formatDate';
import { deleteComment } from '../../actions/post';
import avatar from '../../img/avatar.png';
import spinner from '../layout/spinner.gif';

const CommentItem = ({
  postId,
  comment: { _id, text, name, user, date },
  auth,
  deleteComment
}) => {
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    let unmounted = false;
    getPhoto(user)
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
  }, []);

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <ReactImageFallback
            src={photo}
            fallbackImage={avatar}
            initialImage={spinner}
            alt={name}
            style={{
              verticalAlign: 'middle',
              width: '90px',
              height: '90px',
              borderRadius: '50%'
            }}
          />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">Posted on {formatDate(date)}</p>
        {!auth.loading && user === auth.user._id && (
          <button
            onClick={() => deleteComment(postId, _id)}
            type="button"
            className="btn btn-danger"
          >
            <i className="fas fa-times" />
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
