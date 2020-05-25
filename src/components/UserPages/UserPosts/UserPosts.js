import React from 'react';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';

export const UserPosts = ({ posts }) => {
  return (
    <div className='user-posts-component'>
      <h1>My posts ({posts.length}) </h1>
      <ul className='user-posts-list'>
        {posts.length === 0 ? (
          <li>You have written 0 posts</li>
        ) : (
          <>
            {posts.map((post) => (
              <li key={post.postId}>
                <Link to={`/p/${post.postId}`}>{post.title}</Link>
                <span>{dayjs(post.createdAt).format('DD-MM-YYYY HH:mm:ss')}</span>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
};

export default UserPosts;
