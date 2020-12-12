import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';
import ReactImageFallback from 'react-image-fallback';
import getPhoto from '../../utils/getPhoto';
import avatar from '../../img/avatar.png';
import spinner from '../layout/spinner.gif';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, user, likes, comments, date },
  showActions
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
          {/* <img src={`${API}/profile/photo/${user}`} alt='' className='round-img' /> */}
          <ReactImageFallback
            src={photo}
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
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">Posted on {formatDate(date)}</p>

        {showActions && (
          <Fragment>
            <button
              onClick={() => addLike(_id)}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-up" />{' '}
              <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>
            <button
              onClick={() => removeLike(_id)}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-down" />
            </button>
            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion{' '}
              {comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>
            {!auth.loading && user === auth.user._id && (
              <button
                onClick={() => deletePost(_id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
