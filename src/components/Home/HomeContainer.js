import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';

import Home from './Home';
import { useTheme } from '../../hooks/useTheme';
import { handleFavoritePost, handleUnfavoritePost } from '../../store/actions/userActions';

export const HomeContainer = ({ auth, user, handleFavoritePost, handleUnfavoritePost }) => {
  const firestore = useFirestore();
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState();
  const [loading, setLoading] = useState(true);
  const { PostImagePlaceholder } = useTheme();

  useEffect(() => {
    let unsubscribe = firestore
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          let _posts = [];
          snapshot.forEach((postSnapshot) => {
            _posts.push(postSnapshot.data());
          });
          const _featuredPost = _posts.shift();
          setPosts(_posts);
          setFeaturedPost(_featuredPost);
          setLoading(false);
        },
        (error) => {
          console.error(error);
        }
      );
    return () => unsubscribe();
  }, [firestore]);

  const favoritePost = (postId, postTitle) => handleFavoritePost(postId, postTitle);
  const unfavoritePost = (postId, postTitle) => handleUnfavoritePost(postId, postTitle);

  const checkUserBlogmarks = (postId) => {
    return user.blogmarks.filter(blogmark => blogmark.postId === postId);
  };

  return (
    <Home
      loading={loading}
      posts={posts}
      featuredPost={featuredPost}
      PostImagePlaceholder={PostImagePlaceholder}
      checkUserBlogmarks={checkUserBlogmarks}
      handleFavoritePost={favoritePost}
      handleUnfavoritePost={unfavoritePost}
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
    handleFavoritePost: (postId, postTitle) => dispatch(handleFavoritePost(postId, postTitle)),
    handleUnfavoritePost: (postId, postTitle) => dispatch(handleUnfavoritePost(postId, postTitle)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
