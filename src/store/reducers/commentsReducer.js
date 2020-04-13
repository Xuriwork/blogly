import { 
    POST_COMMENT_SUCCESS, 
    POST_COMMENT_ERROR, 
    COMMENT_DELETION_SUCCESS, 
    COMMENT_DELETION_ERROR
} from '../types';

const initialState = {
    commentError: null
}

const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_COMMENT_SUCCESS : 
            return { 
                ...state,
                commentError: null,
            };
        case POST_COMMENT_ERROR : 
            return {
                ...state,
                commentError: action.payload,
            };
        case COMMENT_DELETION_SUCCESS : 
            return {
                ...state,
                commentError: null,
            };
        case COMMENT_DELETION_ERROR : 
            console.error('COMMENT_DELETION_ERROR', action.payload);
            return {
                ...state,
                commentError: action.payload,
            }
        default:
            return state;
    }
}

export default commentsReducer;