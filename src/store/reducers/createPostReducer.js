import { 
    CREATE_POST_SUCCESS, 
    CREATE_POST_ERROR,
    UPLOAD_POST_IMAGE_SUCCESS, 
    UPLOAD_POST_IMAGE_FAILED 
} from '../types';

const initialState = {
    createPostError: null
}

const createPostReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_POST_SUCCESS : 
            console.log('CREATE_POST_SUCCESS');
            return { 
                ...state,
                createPostError: null,
            };
        case CREATE_POST_ERROR : 
            console.log('CREATE_POST_ERROR', action.payload);
            return {
                ...state,
                createPostError: action.payload,
            };
        case UPLOAD_POST_IMAGE_SUCCESS : 
            return {
                ...state,
                createPostError: null,
            }
        case UPLOAD_POST_IMAGE_FAILED : 
            console.log('UPLOAD_POST_IMAGE_FAILED', action.payload)
            return {
                ...state,
                createPostError: action.payload,
            }
        default:
            return state;
    }
}

export default createPostReducer;