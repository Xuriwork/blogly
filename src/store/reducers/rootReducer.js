import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';

import createPostReducer from './createPostReducer';
import commentsReducer from './commentsReducer';
import updateProfileReducer from './updateProfileReducer';
import uiReducer from './uiReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    userReducer: userReducer,
    createPost: createPostReducer,
    commentsReducer: commentsReducer,
    updateProfileReducer: updateProfileReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    uiReducer: uiReducer
});

export default rootReducer;