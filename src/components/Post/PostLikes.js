import React, { useState, useEffect } from 'react';

export const PostLikes = ({ postLikes, likedPost, likePost, unlikePost }) => {
  const [likeButtonDisabled, setLikeButtonDisabled] = useState(likedPost);

  useEffect(() => {
    if (likedPost) {
      setLikeButtonDisabled(true);
    }
  }, [likedPost])

  const handleLikePost = () => {
    setLikeButtonDisabled(true);
    likePost();
  }

  const handleUnlikePost = () => {
    setLikeButtonDisabled(false);
    unlikePost();
  }

  return (
    <div className='like-component'>
      {likedPost ? (
        <button disabled={!likeButtonDisabled} onClick={handleUnlikePost}>
          <span role='img' aria-label='like button'>
            😀{' '}
            {
              postLikes === 0 ? null : (<span>{postLikes}</span>)
            }
          </span>
        </button>
      ) : (
        <button disabled={likeButtonDisabled} onClick={handleLikePost}>
          <span role='img' aria-label='like button'>
            🙁{' '}
            {
              postLikes === 0 ? null : (<span>{postLikes}</span>)
            }
          </span>
        </button>
      )}
    </div>
  );
};
