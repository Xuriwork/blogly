import React from 'react';
import { Link } from 'react-router-dom';

export const Blogmarks = ({ blogmarks }) => {
  return (
    <div className='blogmarks-component'>
      <h1>Blogmarks ({blogmarks.length}) </h1>
      <ul>
        {blogmarks.map((blogmark) => (
          <li key={blogmark.postId}><Link to={`/p/${blogmark.postId}`}>{blogmark.postTitle}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default Blogmarks;
