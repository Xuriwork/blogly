import React from 'react';
import { useSelector, connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import PostImagePlaceholderLightMode from '../../assets/images/LazyLoadPlaceholderLightMode.png';
import PostImagePlaceholderDarkMode from '../../assets/images/LazyLoadPlaceholderDarkMode.png';
import { likePost, unlikePost } from '../../store/actions/postActions';
import Post from './Post';

export const PostContainer = React.memo((props) => {
  const { auth } = props;

  const likedPost = () => {
    if (
      props.likedPost &&
      props.likedPost.find((like) => like.postId === props.match.params.postId)
    )
      return true;
    else return false;
  };

  useFirestoreConnect([
    {
      collection: 'posts',
      doc: props.match.params.postId,
    },
  ]);

  const post = useSelector(
    ({ firestore: { data } }) =>
      data.posts && data.posts[props.match.params.postId]
  );

  const PostImagePlaceholder = () => {
    const theme = localStorage.getItem('theme');

    switch (theme) {
      case 'dark-mode':
        return PostImagePlaceholderDarkMode;
      case 'light-mode':
        return PostImagePlaceholderLightMode;
      default:
        return PostImagePlaceholderDarkMode;
    }
  };

  const handleLikePost = () => {
    if (auth.isEmpty) return;
    props.likePost(props.match.params.postId);
  };

  const handleUnlikePost = () => {
    if (auth.isEmpty) return;
    props.unlikePost(props.match.params.postId);
  };

  return (  
    <Post 
        auth={auth} 
        post={post} 
        PostImagePlaceholder={PostImagePlaceholder} 
        likedPost={likedPost} 
        handleLikePost={handleLikePost} 
        handleUnlikePost={handleUnlikePost}
    />
  )
});

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.firebase.auth,
    likedPost: state.userReducer.likes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    likePost: (data) => dispatch(likePost(data)),
    unlikePost: (data) => dispatch(unlikePost(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
