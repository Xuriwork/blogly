const initState = {
    authError: null
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case 'SIGNIN_SUCCESS' : 
            return {
                ...state,
                authError: null,
            }
        case 'SIGNIN_ERROR': 
            return {
                ...state, 
                authError: action.payload
            }
        case 'SIGNUP_SUCCESS' : 
            return {
                ...state,
                authError: null,
            }
        case 'SIGNUP_ERROR' : 
            console.log(action.payload)
            return {
                ...state,
                authError: action.payload,
            }
        case 'SIGNUP_PROFILE_UPDATE_SUCCESS' : 
            return {
                ...state,
                authError: null,
            }
        case 'SIGNOUT_SUCCESS' : 
            return state;
        case 'PASSWORD_RESET_EMAIL_SENT' : 
            return {
                ...state,
                authError: null,
            }
        case 'PASSWORD_RESET_EMAIL_ERROR' : 
            return {
                ...state,
                authError: action.payload,
            }
        case 'RESET' : 
            return initState;
        default: 
            return state;
    }
}

export default authReducer;