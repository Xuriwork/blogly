import React from 'react';
import UserPosts from './UserPosts';
import { connect } from 'react-redux';

const UserPostsContainer = ({ posts }) => {
  return <UserPosts posts={posts} />;
};

const mapStateToProps = (state) => {
  return {
    posts: state.userReducer.posts,
  };
};

export default connect(mapStateToProps)(UserPostsContainer);
