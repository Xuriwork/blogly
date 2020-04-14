import {
  POST_COMMENT_SUCCESS,
  POST_COMMENT_ERROR,
  COMMENT_DELETION_SUCCESS,
  COMMENT_DELETION_ERROR,
  SET_ERRORS,
} from '../types';

export const postComment = ({ content, slug }) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const firestore = getFirebase().firestore();
    const username = getState().firebase.profile.username;
    const userId = getState().firebase.auth.uid;
    const authorProfilePicture = getState().firebase.profile.userImageURL;
    const increment = firebase.firestore.FieldValue.increment(1);

    const postCommentsRef = firestore
      .collection('posts')
      .doc(slug)
      .collection('comments');

    const newComment = {
      author: username,
      authorId: userId,
      authorProfilePicture,
      content,
      createdAt: new Date()
    };

    postCommentsRef
      .add(newComment)
      .then(() => {
        dispatch({ type: POST_COMMENT_SUCCESS });
      })
      .then(() => {
        return firestore
          .collection('posts')
          .doc(slug)
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
    const { commentId, slug } = props;
    const firebase = getFirebase();
    const firestore = getFirebase().firestore();
    const increment = firebase.firestore.FieldValue.increment(-1);

    const batch = firestore.batch();

    const postRef = firestore.collection('posts').doc(slug);

    const postCommentsRef = firestore
      .collection('posts')
      .doc(slug)
      .collection('comments')
      .doc(commentId);

    firestore
      .collection('posts')
      .doc(slug)
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
        batch.update(postRef, { commentCount: increment });
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
