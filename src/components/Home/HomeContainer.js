import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';

import Home from './Home';
import { useTheme } from '../../hooks/useTheme';
import { handleMarkPost, handleUnmarkPost } from '../../store/actions/userActions';
import Loading from '../../utils/Loading';

export const HomeContainer = ({ auth, user, handleMarkPost, handleUnmarkPost }) => {
  const firestore = useFirestore();
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState();
  const [loading, setLoading] = useState(true);
  const { PostImagePlaceholder } = useTheme();

  useEffect(() => {
    let unsubscribe = firestore
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
          let _posts = [];
          snapshot.forEach((postSnapshot) => {
            _posts.push(postSnapshot.data());
          });
          const _featuredPost = _posts.shift();
          setPosts(_posts);
          setFeaturedPost(_featuredPost);
          setLoading(false);
        }, (error) => {
          console.error(error);
        }
      );
    return () => unsubscribe();
  }, [firestore]);

  const markPost = (postId, postTitle) => handleMarkPost(postId, postTitle);
  const unmarkPost = (postId, postTitle) => handleUnmarkPost(postId, postTitle);

  const checkUserBlogmarks = (postId) => user.blogmarks.filter(blogmark => blogmark.postId === postId);

  if (loading) return <Loading />;

  return (
    <Home
      loading={loading}
      posts={posts}
      featuredPost={featuredPost}
      PostImagePlaceholder={PostImagePlaceholder}
      checkUserBlogmarks={checkUserBlogmarks}
      handleMarkPost={markPost}
      handleUnmarkPost={unmarkPost}
      auth={auth.isEmpty}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.userReducer,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleMarkPost: (postId, postTitle) => dispatch(handleMarkPost(postId, postTitle)),
    handleUnmarkPost: (postId, postTitle) => dispatch(handleUnmarkPost(postId, postTitle)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
