import {
  SET_POSTS,
  CREATE_POST_SUCCESS,
  CREATE_POST_ERROR,
  UPLOAD_POST_IMAGE_SUCCESS,
  UPLOAD_POST_IMAGE_FAILED,
} from '../types';

const initialState = {
  createPostError: null,
  posts: [],
  post: {},
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POSTS :
      return {
        ...state,
        posts: action.payload,
      };
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        createPostError: null,
      };
    case CREATE_POST_ERROR:
      return {
        ...state,
        createPostError: action.payload,
      };
    case UPLOAD_POST_IMAGE_SUCCESS:
      return {
        ...state,
        createPostError: null,
      };
    case UPLOAD_POST_IMAGE_FAILED:
      return {
        ...state,
        createPostError: action.payload,
      };
    default:
      return state;
  }
};

export default postsReducer;
