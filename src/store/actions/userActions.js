import {
  PASSWORD_RESET_EMAIL_SENT,
  SET_UNAUTHENTICATED,
  SET_USER_POSTS,
  SET_USER_LIKES,
  SET_ERRORS,
} from '../types';
import { validateUserSignUpData } from '../../utils/validators.js';

export const signIn = ({ creds, history }) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const { email, password } = creds;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        history.push('/');
        window.location.reload(true);
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          return dispatch({
            type: SET_ERRORS,
            payload:
              'There is no existing user record corresponding to the provided identifier.',
          });
        } else {
          dispatch({
            type: SET_ERRORS,
            payload: error.message,
          });
        }
      });
  };
};

export const signUp = ({ creds, history }) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();
    const randomUsertagNumber = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(0, 4);
    const { username, email, password, confirmPassword } = creds;

    const newUser = {
      email,
      password,
      username,
      confirmPassword,
      usertag: username + '#' + randomUsertagNumber,
    };

    const { valid, errors } = validateUserSignUpData(newUser);
    if (!valid) return dispatch({ payload: errors });

    const defaultUserProfileImagePath =
      'https://firebasestorage.googleapis.com/v0/b/blogly-xuri.appspot.com/o/users%2Fdefault_user_profile_image.svg?alt=media';

    let userId;
    firestore
      .collection('users')
      .where('usertag', '==', newUser.usertag)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return dispatch({
            type: SET_ERRORS,
            payload: 'Sorry, there are too many users who share this username',
          });
        } else {
          return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
      })
      .then((data) => {
        userId = data.user.uid;
        data.user.usertag = newUser.usertag;
        data.user.updateProfile({
          displayName: newUser.username,
          photoURL: defaultUserProfileImagePath,
        });
        return data;
      })
      .then((data) => {
        const userInfo = {
          userId: userId,
          email: newUser.email,
          usertag: newUser.usertag,
          username: newUser.username,
          userImageURL: defaultUserProfileImagePath,
          createdAt: new Date(),
        };
        return firestore.collection('users').doc(userId).set(userInfo);
      })
      .then(() => {
        history.push('/');
        window.location.reload(true);
      })
      .catch((error) => {
        dispatch({
          type: SET_ERRORS,
          payload: error.message,
        });
      });
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: SET_UNAUTHENTICATED });
      })
      .catch((error) => {
        dispatch({
          type: SET_ERRORS,
          payload: error.message,
        });
      });
  };
};

export const sendPasswordResetEmail = ({ email }) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        dispatch({ type: PASSWORD_RESET_EMAIL_SENT });
      })
      .catch((error) => {
        dispatch({
          type: SET_ERRORS,
          payload: error.message,
        });
      });
  };
};

export const getUserData = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firestore = getFirebase().firestore();
    const userId = getState().firebase.auth.uid;

    let userData = {};

    firestore
      .collection('users')
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return firestore
            .collection('posts')
            .where('authorId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get()
            .then((docs) => {
              userData.posts = [];
              docs.forEach((doc) => {
                userData.posts.push({
                  body: doc.data().body,
                  author: doc.data().author,
                  authorProfilePictureURL: doc.data().authorProfilePictureURL,
                  likeCount: doc.data().likeCount,
                  commentCount: doc.data().commentCount,
                  createdAt: doc.data().createdAt,
                  postId: doc.id,
                });
              });
              dispatch({ type: SET_USER_POSTS, payload: userData.posts });
            })
        } else {
          return console.error('User not found');
        }
      })
      .then(() => {
        return firestore
          .collection('likes')
          .where('userId', '==', userId)
          .onSnapshot((docs) => {
            userData.likes = [];
            docs.forEach((doc) => {
              userData.likes.push(doc.data());
            });
            dispatch({ type: SET_USER_LIKES, payload: userData.likes });
          })
      })
      .catch((error) => {
        console.error(error);
      });
  };
};
