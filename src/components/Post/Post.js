import React from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Redirect, Link } from 'react-router-dom';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import Loading from '../../utils/Loading';
import { PostMoreActionsModal } from './MorePostActionsModal';
import { LikePostButton } from './LikePostButton';
import { MarkPostButton } from './MarkPostButton';

const Post = React.memo(
  ({
    auth,
    post,
    PostImagePlaceholder,
    postIsLiked,
    handleLikePost,
    handleUnlikePost,
    checkUserBlogmarks,
    handleUnmarkPost,
    handleMarkPost,
  }) => {

    if (!isLoaded(post)) return <Loading />;
    if (isEmpty(post)) return <Redirect to='/404' />;

    return (
      <>
        <section>
          <div className='post-component'>
            <div className='post-image-container'>
              <LazyLoadImage
                src={post.coverImageURL}
                alt={post.coverImageAlt}
                placeholderSrc={PostImagePlaceholder}
                effect='blur'
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
              <p className='post-body'>{post.body}</p>
            </div>
            <div className='post-footer'>
              <LikePostButton
                postLikes={post.likeCount}
                postIsLiked={postIsLiked}
                likePost={handleLikePost}
                unlikePost={handleUnlikePost}
              />
              <MarkPostButton
                checkUserBlogmarks={checkUserBlogmarks}
                postId={post.postId}
                postTitle={post.title}
                handleUnmarkPost={handleUnmarkPost}
                handleMarkPost={handleMarkPost}
              />
            </div>
          </div>
          <hr />
          <Link
            to={{
              pathname: `/p/${post.postId}/comments`,
              state: {
                postTitle: post.title,
              },
            }}
            className='long-container long-container-post'
          >
            See comments ({post.commentCount})
          </Link>
        </section>
      </>
    );
  }
);

export default Post;
