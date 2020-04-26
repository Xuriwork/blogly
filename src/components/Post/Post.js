import React from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Redirect, Link } from 'react-router-dom';

import IronImage from 'react-image-lazy-load-component';
import Loading from '../../utils/Loading';
import { PostMoreActionsModal } from './PostMoreActionsModal';
import { PostLikes } from './PostLikes';

const Post = React.memo((props) => {

  const { auth, post, PostImagePlaceholder, likedPost, handleLikePost, handleUnlikePost } = props;

  if (!isLoaded(post)) {
    return <Loading />;
  }

  if (isEmpty(post)) {
    return <Redirect to='/404' />;
  }

  return (
    <>
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
              <PostMoreActionsModal auth={auth} post={post} />
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
    </>
  );
});

export default Post;
