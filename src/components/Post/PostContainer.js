import React from 'react';
import { useSelector, connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import { likePost, unlikePost } from '../../store/actions/postActions';
import { handleMarkPost, handleUnmarkPost } from '../../store/actions/userActions';
import Post from './Post';
import { useTheme } from '../../hooks/useTheme';

export const PostContainer = React.memo((props) => {
  const { auth, user, handleMarkPost, handleUnmarkPost } = props;
  const { PostImagePlaceholder } = useTheme();

  const checkIfPostIsLiked = () => {
    if (props.postIsLiked && props.postIsLiked.find((like) => like.postId === props.match.params.postId)) return true;
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

  const handleLikePost = () => {
    if (auth.isEmpty) return;
    props.likePost(props.match.params.postId);
  };

  const handleUnlikePost = () => {
    if (auth.isEmpty) return;
    props.unlikePost(props.match.params.postId);
  };

  const postIsLiked = checkIfPostIsLiked();

  const markPost = (postId, postTitle) => {
    if (auth.isEmpty) return;
    handleMarkPost(postId, postTitle);
  };

  const unmarkPost = (postId, postTitle) => {
    if (auth.isEmpty) return;
    handleUnmarkPost(postId, postTitle)
  };

  const checkUserBlogmarks = (postId) => user.blogmarks.filter(blogmark => blogmark.postId === postId);

  return (  
    <Post 
        auth={auth} 
        post={post} 
        PostImagePlaceholder={PostImagePlaceholder} 
        postIsLiked={postIsLiked} 
        handleLikePost={handleLikePost} 
        handleUnlikePost={handleUnlikePost}
        checkUserBlogmarks={checkUserBlogmarks}
        handleMarkPost={markPost}
        handleUnmarkPost={unmarkPost}
    />
  )
});

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.firebase.auth,
    postIsLiked: state.userReducer.likes,
    user: state.userReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    likePost: (data) => dispatch(likePost(data)),
    unlikePost: (data) => dispatch(unlikePost(data)),
    handleMarkPost: (postId, postTitle) => dispatch(handleMarkPost(postId, postTitle)),
    handleUnmarkPost: (postId, postTitle) => dispatch(handleUnmarkPost(postId, postTitle)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
