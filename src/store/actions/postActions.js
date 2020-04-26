import { customAlphabet } from 'nanoid/non-secure';
import { CREATE_POST_SUCCESS, SET_ERRORS } from '../types';
import { isEmpty } from '../../utils/validators';
import shortid from 'shortid';

export const createPost = (post) => {
  return (dispatch, getState, { getFirebase }) => {
    const firestore = getFirebase().firestore();
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);
    const username = getState().firebase.profile.username;
    const userId = getState().firebase.auth.uid;
    const authorProfilePictureURL = getState().firebase.profile.userImageURL;

    if (isEmpty(post.title || post.slug || post.body || post.coverImageURL)) {
      return dispatch({
        type: SET_ERRORS,
        payload: 'Fields must not be empty',
      });
    }

    const slugify = post.title
      .toLowerCase()
      .trim()
      .replace(/&/g, '-and-')
      .replace(/[\s\W-]+/g, '-');

    const createSlug = () => {
      const slugId = nanoid();
      return `${slugify}-${slugId}`;
    };

    const postId = createSlug();

    const newPost = {
      author: username,
      authorId: userId,
      authorProfilePictureURL,
      postId,
      title: post.title,
      body: post.body,
      coverImageURL: post.coverImageURL,
      coverImageAlt: post.coverImageAlt,
      createdAt: new Date(),
      commentCount: 0,
      likeCount: 0
    };

    firestore
      .collection('posts')
      .doc(postId)
      .set(newPost)
      .then(() => {
        dispatch({ type: CREATE_POST_SUCCESS });
      })
      .catch((error) => {
        console.error(error);
        dispatch({
          type: SET_ERRORS,
          payload: error.message,
        });
      });
  };
};

export const handleUploadCoverImage = (props) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const { image, setProgress, setCoverImageURL } = props;
    const randomFilename = shortid.generate()

    const postImageRef = firebase
      .storage()
      .ref(`blog_posts_images`)
      .child(randomFilename)
      .put(image);

    postImageRef.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        dispatch({ type: 'UPLOAD_POST_IMAGE_FAILED', payload: error.message });
      },
      () => {
        firebase
          .storage()
          .ref(`blog_posts_images`)
          .child(randomFilename)
          .getDownloadURL()
          .then((url) => {
            console.log(url)
            setCoverImageURL(url);
          });
        dispatch({ type: 'UPLOAD_POST_IMAGE_SUCCESS' });
      }
    );
  };
};

export const deletePost = (post) => {
  return (dispatch, getState, { getFirebase }) => {
    const firestore = getFirebase().firestore();
    const userId = getState().firebase.auth.uid;

    const postDocumentRef = firestore.collection('posts').doc(post.postId);

    postDocumentRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return dispatch({ type: SET_ERRORS, payload: 'Post not found' });
        }
        if (doc.data().authorId !== userId) {
          return dispatch({
            type: SET_ERRORS,
            payload: 'Unauthorized permission',
          });
        } else {
          return postDocumentRef.delete();
        }
      })
      .then(() => {
        return dispatch({
          type: SET_ERRORS,
          payload: 'Post successfully deleted',
        });
      })
      .catch((error) => {
        console.error(error);
        return dispatch({ type: SET_ERRORS, error: error.message });
      });
  };
};

export const likePost = (postId) => {
  return (dispatch, getState, { getFirebase }) => {
    const firestore = getFirebase().firestore();
    const userId = getState().firebase.auth.uid;
    const firebase = getFirebase();
    const postDocumentRef = firestore.collection('posts').doc(postId);

    const increment = firebase.firestore.FieldValue.increment(1);

    const likeDocument = firestore
      .collection('likes')
      .where('userId', '==', userId)
      .where('postId', '==', postId)
      .limit(1);

    likeDocument
      .get()
      .then((doc) => {
        if (doc.empty) {
          return firestore
            .collection('likes')
            .add({
              postId,
              userId,
              liked: true,
              timestamp: new Date(),
            })
            .then(() => {
              return postDocumentRef.update({
                likeCount: increment,
              });
            });
        } else {
          dispatch({
            type: SET_ERRORS,
            payload: 'This post has already been liked',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return dispatch({ type: SET_ERRORS, payload: error.message });
      });
  };
};

export const unlikePost = (postId) => {
  return (dispatch, getState, { getFirebase }) => {
    const firestore = getFirebase().firestore();
    const userId = getState().firebase.auth.uid;
    const firebase = getFirebase();
    const postDocumentRef = firestore.collection('posts').doc(postId);
    const decrement = firebase.firestore.FieldValue.increment(-1);

    const likeDocument = firestore
      .collection('likes')
      .where('userId', '==', userId)
      .where('postId', '==', postId)
      .limit(1);

    likeDocument
      .get()
      .then((data) => {
        if (data.empty) {
          return dispatch({ type: SET_ERRORS, payload: 'Post not liked' });
        } else {
          return firestore
            .collection('likes')
            .doc(data.docs[0].id)
            .delete()
            .then(() => {
              return postDocumentRef.update({
                likeCount: decrement,
              });
            });
        }
      })
      .catch((error) => {
        console.error(error);
        return dispatch({ type: SET_ERRORS, payload: error.message });
      });
  };
};
