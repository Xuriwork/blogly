import {
  SET_USER,
  MARK_NOTIFICATIONS_READ,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  PASSWORD_RESET_EMAIL_SENT,
} from '../types';

const initialState = {
  authenticated: false,
  loading: false,
  userData: {},
  likes: [],
  notifications: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
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
