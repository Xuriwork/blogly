import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useForm } from 'react-hook-form';
import NotyfContext from '../../utils/NotyfContext';
import {
  postComment,
  deleteComment,
} from '../../store/actions/commentsActions';
import Comments from './Comments';

export const CommentsContainer = React.memo((props) => {
  const { auth, match, history, commentError } = props;
  const postId = match.params.postId;
  const firestore = useFirestore();

  const [postTitle, setPostTitle] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm();
  const notyf = useContext(NotyfContext);

  useEffect(() => {
    const postRef = firestore.collection('posts').doc(postId);
    postRef.get().then((snapshot) => {
      const { title } = snapshot.data();
      setPostTitle(title);
      postRef
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          (snapshot) => {
            let _comments = [];
            snapshot.forEach((commentSnapshot) => {
              const thisComment = commentSnapshot.data();
              _comments.push({
                commentData: thisComment,
                commentId: commentSnapshot.id,
              });
            });
            setComments(_comments);
            setLoading(false);
          },
          (error) => {
            console.error(error);
          }
        );
    });
  }, [firestore, postId]);

  const postComment = async ({ content }) => {
    if (auth.isEmpty) {
      notyf.error('You are not authenticated 😕');
      return;
    }
    await props.postComment({ content, postId });
    reset();
  };

  const deleteComment = (commentId, authorId) => {
    const currentUserId = auth.uid;
    const commentUserId = authorId;

    if (!comments) {
      return;
    }

    if (currentUserId !== commentUserId) {
      notyf.error("That's not your comment");
      return;
    }

    props.deleteComment({ commentId, authorId, postId });
  };

  const back = () => {
    history.push(`/p/${postId}`);
  };

  return (
    <Comments
      loading={loading} 
      comments={comments}
      auth={auth}
      back={back}
      register={register}
      handleSubmit={handleSubmit}
      postTitle={postTitle}
      commentError={commentError}
      postComment={postComment}
      deleteComment={deleteComment}
    />
  );
});

const mapDispatchToProps = (dispatch) => {
  return {
    postComment: (comment) => dispatch(postComment(comment)),
    deleteComment: (commentToDelete) =>
      dispatch(deleteComment(commentToDelete)),
  };
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    commentError: state.commentsReducer.commentError,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);
