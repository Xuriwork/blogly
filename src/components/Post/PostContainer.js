import React from 'react';
import { useSelector, connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import { likePost, unlikePost } from '../../store/actions/postActions';
import Post from './Post';
import { useTheme } from '../../hooks/useTheme';

export const PostContainer = React.memo((props) => {
  const { auth } = props;
  const { PostImagePlaceholder } = useTheme();

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
