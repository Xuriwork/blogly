export const updateProfileInfo = (profileInfo) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.updateProfile({ 
            bio: profileInfo.bio 
        })
        .then(() => {
            dispatch({ 
                type: 'UPDATE_PROFILE_SUCCESS', 
                payload: profileInfo,
            })
        })
        .catch((error) => {
            dispatch({ 
                type: 'UPDATE_PROFILE_ERROR', 
                payload: error.message,
            });
        })
    }
};

export const uploadProfilePicture = (props) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const { image, userStorageRef } = props;

        userStorageRef
        .child(image)
        .getDownloadURL()
        .then((url) => {
            firebase.updateProfile({ profilePictureURL: url })
            dispatch({ 
                type: 'UPLOAD_PROFILE_PICTURE_SUCCESS',
                payload: url,
            });
        })
        .catch((error) => {
            dispatch({ 
                type: 'UPLOAD_PROFILE_PICTURE_ERROR', 
                payload: error.message,
            });
        })

    }
}