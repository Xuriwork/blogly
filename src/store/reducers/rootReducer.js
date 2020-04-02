import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';

import authReducer from './authReducer';
import createPostReducer from './createPostReducer';
import commentsReducer from './commentsReducer';
import updateProfileReducer from './updateProfileReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    createPost: createPostReducer,
    commentsReducer: commentsReducer,
    updateProfileReducer: updateProfileReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer,
});

export default rootReducer;