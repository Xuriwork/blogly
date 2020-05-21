import React, { useState, useEffect } from 'react';

export const LikePostButton = React.memo(({ postLikes, postIsLiked, likePost, unlikePost }) => {
  const [likeButtonDisabled, setLikeButtonDisabled] = useState(postIsLiked);

  useEffect(() => {
    if (postIsLiked) {
      setLikeButtonDisabled(true);
    }
  }, [postIsLiked])

  const handleLikePost = () => {
    setLikeButtonDisabled(true);
    likePost();
  };

  const handleUnlikePost = () => {
    setLikeButtonDisabled(false);
    unlikePost();
  };

  return (
    <div className='like-component'>
      {postIsLiked ? (
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
});
