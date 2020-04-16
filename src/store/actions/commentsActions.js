import {
  POST_COMMENT_SUCCESS,
  POST_COMMENT_ERROR,
  COMMENT_DELETION_SUCCESS,
  COMMENT_DELETION_ERROR,
  SET_ERRORS,
} from '../types';

export const postComment = ({ content, postId }) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const firestore = getFirebase().firestore();
    const username = getState().firebase.profile.username;
    const userId = getState().firebase.auth.uid;
    const authorProfilePicture = getState().firebase.profile.userImageURL;
    const increment = firebase.firestore.FieldValue.increment(1);

    const postCommentsRef = firestore
      .collection('posts')
      .doc(postId)
      .collection('comments');

    const newComment = {
      author: username,
      authorId: userId,
      authorProfilePicture,
      content,
      createdAt: new Date(),
    };

    postCommentsRef
      .add(newComment)
      .then(() => {
        dispatch({ type: POST_COMMENT_SUCCESS });
      })
      .then(() => {
        return firestore
          .collection('posts')
          .doc(postId)
          .update({ commentCount: increment });
      })
      .catch((error) => {
        dispatch({
          type: POST_COMMENT_ERROR,
          payload: error.message,
        });
      });
  };
};

export const deleteComment = (props) => {
  return (dispatch, getState, { getFirebase }) => {
    const { commentId, postId } = props;
    const firebase = getFirebase();
    const firestore = getFirebase().firestore();
    const decrement = firebase.firestore.FieldValue.increment(-1);

    const batch = firestore.batch();

    const postDocumentRef = firestore.collection('posts').doc(postId);

    const postCommentsRef = firestore
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .doc(commentId);

    postDocumentRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return dispatch({
            type: SET_ERRORS,
            payload: "Comment doesn't exist",
          });
        }
      })
      .then(() => {
        batch.delete(postCommentsRef);
        batch.update(postDocumentRef, { commentCount: decrement });
        batch.commit();
        dispatch({ type: COMMENT_DELETION_SUCCESS });
      })
      .catch((error) => {
        dispatch({
          type: COMMENT_DELETION_ERROR,
          payload: error.message,
        });
      });
  };
};
