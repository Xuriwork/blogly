import {
  UPDATE_PROFILE_SUCCESS,
  UPLOAD_PROFILE_PICTURE_SUCCESS,
  UPLOAD_PROFILE_PICTURE_ERROR,
  SET_ERRORS,
} from '../types';
import { formatUserDetails } from '../../utils/validators';

export const updateProfileInfo = ({ profileInfo, history }) => {
  return (dispatch, getState, { getFirebase }) => {
    const firestore = getFirebase().firestore();
    const userId = getState().firebase.auth.uid;
    let userDetails = formatUserDetails(profileInfo);
    const user = getFirebase().auth().currentUser;

    if (profileInfo.currentPassword.trim() === '') return true;

    firestore
      .collection('users')
      .doc(userId)
      .update(userDetails)
      .then(() => {
        if (userDetails.email) {
          user.updateEmail(userDetails.email)
        }
      })
      .then(() => {
        return dispatch({
          type: UPDATE_PROFILE_SUCCESS,
          payload: 'User info successfully updated',
        });
      })
      .catch((error) => {
        console.error(error);
        if (error.code === 'auth/wrong-password') {
          return dispatch({
            type: SET_ERRORS,
            payload: 'This password is incorrect',
          });
        }
        dispatch({ type: SET_ERRORS, payload: error.message });
      });
  };
};

export const uploadProfilePicture = (props) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const { imageName, userStorageRef } = props;

    console.log(imageName);
    userStorageRef
      .child(imageName)
      .getDownloadURL()
      .then((url) => {
        firebase.updateProfile({ userImageURL: url });
        firebase.auth().currentUser.updateProfile({ photoURL: url });
        dispatch({
          type: UPLOAD_PROFILE_PICTURE_SUCCESS,
          payload: url,
        });
      })
      .catch((error) => {
        dispatch({
          type: UPLOAD_PROFILE_PICTURE_ERROR,
          payload: error.message,
        });
      });
  };
};
