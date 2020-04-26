import {
  SET_USER_POSTS,
  SET_USER_LIKES,
  SET_USER_NOTIFICATIONS,
  MARK_NOTIFICATIONS_READ,
  SET_UNAUTHENTICATED,
  PASSWORD_RESET_EMAIL_SENT,
} from '../types';

const initialState = {
  loading: false,
  posts: [],
  likes: [],
  notifications: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_LIKES:
      return {
        ...state,
        likes: action.payload
      };
    case SET_USER_POSTS : 
      return {
        ...state,
        posts: action.payload
      };
      case SET_USER_NOTIFICATIONS : 
      return {
        ...state,
        notifications: action.payload
      }
    case SET_UNAUTHENTICATED:
      return initialState;
    case PASSWORD_RESET_EMAIL_SENT:
      return {
        ...state,
        errors: null,
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default userReducer;
