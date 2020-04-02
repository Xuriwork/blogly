const initState = {
    updateProfileError: null,
}

const updateProfileReducer = (state = initState, action) => {
    switch (action.type) {
        case 'UPDATE_PROFILE' : 
            return { 
                ...state,
                updateProfileError: null,
            };
        case 'UPDATE_PROFILE_ERROR' : 
            console.log('UPDATE_PROFILE_ERROR', action.payload);
            return {
                ...state,
                updateProfileError: action.payload,
            };
        case 'UPLOAD_PROFILE_PICTURE_SUCCESS' : 
            return {
                ...state,
                updateProfileError: null,
            }
        case 'UPLOAD_PROFILE_PICTURE_ERROR' :
            console.log('UPLOAD_PROFILE_PICTURE_ERROR', action.payload);
            return {
                ...state,
                updateProfileError: action.payload,
            }
        default:
            return state;
    }
}

export default updateProfileReducer;