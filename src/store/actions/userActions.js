import axios from 'axios';
import {
  SET_AUTHENTICATED,
  PASSWORD_RESET_EMAIL_SENT,
  SET_UNAUTHENTICATED,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_USER,
} from '../types';
import { validateUserSignUpData } from '../../utils/validators.js';

export const getUserData = () => (dispatch) => {
  axios
    .get('/user')
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((error) => console.log(error));
};

const setAuthorizationHeader = (token) => {
  const userToken = `Bearer ${token}`;
  localStorage.setItem('userToken', userToken);
  axios.defaults.headers.common['Authorization'] = userToken;
};

export const signIn = ({ creds, history }) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const { email, password } = creds;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        console.log(data.user.getIdToken());
        return data.user.getIdToken();
      })
      .then((token) => {
        setAuthorizationHeader(token);
        dispatch({ type: SET_AUTHENTICATED });
        history.push('/');
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          return dispatch({
            type: SET_ERRORS,
            payload:
              'There is no existing user record corresponding to the provided identifier.',
          });
        }
        dispatch({
          type: SET_ERRORS,
          payload: error.message,
        });
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
        firestore.collection('users').doc(userId).set(userInfo);
        return data.user.getIdToken();
      })
      .then((token) => {
        setAuthorizationHeader(token);
        dispatch({ type: SET_AUTHENTICATED });
        dispatch({ type: CLEAR_ERRORS });
        console.log('test2');
        //history.push('/');
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
        localStorage.removeItem('userToken');
        delete axios.defaults.headers.common['Authorization'];
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
