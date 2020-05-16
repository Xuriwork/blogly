import React from 'react';

export const MarkPostButton = ({ checkUserBlogmarks, postId, postTitle, handleUnmarkPost, handleMarkPost }) => {
  const ifBlogmarkIsMarked = checkUserBlogmarks(postId).length === 0;

  return (
        <button className='mark-button' onClick={ifBlogmarkIsMarked ? () => handleMarkPost(postId, postTitle) : () => handleUnmarkPost(postId, postTitle)}>
        <span>
          {ifBlogmarkIsMarked ? (
            <svg
              width='24'
              height='24'
              xmlns='http://www.w3.org/2000/svg'
              fillRule='evenodd'
              clipRule='evenodd'
            >
              <path d='M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z' />
            </svg>
          ) : (
            <svg
              width='24'
              height='24'
              xmlns='http://www.w3.org/2000/svg'
              fillRule='evenodd'
              clipRule='evenodd' 
              fill='#31AF91'
            >
              <path d='M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z' />
            </svg>
          )}
          </span>
        </button>
  );
};

export default MarkPostButton;
