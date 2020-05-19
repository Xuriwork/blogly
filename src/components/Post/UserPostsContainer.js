import React from 'react';
import UserPosts from './UserPosts';
import { connect } from 'react-redux';
import Loading from '../../utils/Loading';

const UserPostsContainer = ({ posts, loading }) => {
  if (loading) return <Loading />;
  return <UserPosts posts={posts} />;
};

const mapStateToProps = (state) => {
  return {
    posts: state.userReducer.posts,
    loading: state.uiReducer.loading
  };
};

export default connect(mapStateToProps)(UserPostsContainer);
