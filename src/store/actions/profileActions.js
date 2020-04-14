import { UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_ERROR, UPLOAD_PROFILE_PICTURE_SUCCESS, UPLOAD_PROFILE_PICTURE_ERROR } from '../types';

export const updateProfileInfo = (profileInfo) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.updateProfile({ 
            bio: profileInfo.bio 
        })
        .then(() => {
            dispatch({ 
                type: UPDATE_PROFILE_SUCCESS, 
                payload: profileInfo,
            })
        })
        .catch((error) => {
            dispatch({ 
                type: UPDATE_PROFILE_ERROR, 
                payload: error.message,
            });
        })
    }
};

export const uploadProfilePicture = (props) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const { imageName, userStorageRef } = props;
        
        console.log(imageName)
        userStorageRef
        .child(imageName)
        .getDownloadURL()
        .then((url) => {
            firebase.updateProfile({ userImageURL: url })
            firebase.auth().currentUser.updateProfile({ photoURL: url })
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
        })

    }
}