import React from 'react';
import { useSelector, connect } from 'react-redux';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { Redirect, Link } from 'react-router-dom';

import IronImage from 'react-image-lazy-load-component';
import Loading from '../../utils/Loading';
import PostImagePlaceholderLightMode from '../../assets/images/LazyLoadPlaceholderLightMode.png';
import PostImagePlaceholderDarkMode from '../../assets/images/LazyLoadPlaceholderDarkMode.png';
import { PostMoreActionsModal } from './PostMoreActionsModal';
import { PostLikes } from './PostLikes';
import { likePost, unlikePost } from '../../store/actions/postActions';

const Post = (props) => {
  const { auth } = props;

  const likedPost = () => {
    if (
      props.likedPost &&
      props.likedPost.find((like) => like.postId === props.match.params.postId)
    )
      return true;
    else return false;
  };

  useFirestoreConnect([
    {
      collection: 'posts',
      doc: props.match.params.postId,
    },
  ]);

  const post = useSelector(
    ({ firestore: { data } }) =>
      data.posts && data.posts[props.match.params.postId]
  );

  const PostImagePlaceholder = () => {
    const theme = localStorage.getItem('theme');

    switch (theme) {
      case 'dark-mode':
        return PostImagePlaceholderDarkMode;
      case 'light-mode':
        return PostImagePlaceholderLightMode;
      default:
        return PostImagePlaceholderDarkMode;
    }
  };

  const handleLikePost = () => {
    if (auth.isEmpty) return;
    props.likePost(props.match.params.postId);
  };

  const handleUnlikePost = () => {
    if (auth.isEmpty) return;
    props.unlikePost(props.match.params.postId);
  };

  if (!isLoaded(post)) {
    return <Loading />;
  }

  if (isEmpty(post)) {
    return <Redirect to='/404' />;
  }

  return (
    <main className='main'>
      <section>
        <div className='post-component'>
          <div>
            <IronImage
              src={post.coverImageURL}
              alt={post.coverImageAlt}
              placeholder={PostImagePlaceholder()}
            />
          </div>
          <div className='post-content'>
            <h1>{post.title}</h1>
            <div className='author-post-details'>
              <img
                src={post.authorProfilePictureURL}
                alt='Profile'
                className='profile-picture'
              />
              <span className='usertag-span'>{post.author}</span>
              {auth.uid === post.authorId ? null : <button>Follow</button>}
              <PostMoreActionsModal />
            </div>
            <em>{post.datePretty}</em>
            <p>{post.body}</p>
          </div>
          <PostLikes
            postLikes={post.likeCount}
            likedPost={likedPost()}
            likePost={handleLikePost}
            unlikePost={handleUnlikePost}
          />
        </div>
        <hr />
        <Link
          to={{
            pathname: `/p/${post.postId}/comments`,
            state: {
              postTitle: post.title,
            },
          }}
          className='long-container long-container-post'>
          See comments ({post.commentCount})
        </Link>
      </section>
    </main>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.firebase.auth,
    likedPost: state.userReducer.likes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    likePost: (data) => dispatch(likePost(data)),
    unlikePost: (data) => dispatch(unlikePost(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
