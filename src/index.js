import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider, useSelector } from 'react-redux';
import { ReactReduxFirebaseProvider, isLoaded } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import createReduxStore from './store/createReduxStore';
import { DarkLightModeProvider } from './helpers/DarkLightModeContext';

import firebase from './helpers/Firebase';
import Loading from './helpers/Loading';

const store = createReduxStore();

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}

const rrfProps = {
   firebase,
   config: rrfConfig,
   dispatch: store.dispatch,
   createFirestoreInstance,
}

const AuthIsLoaded = ({ children }) => {
    const auth = useSelector(state => state.firebase.auth);
    if (!isLoaded(auth)) {
        return (
            <Loading />
        );
    }
    return children;
}

ReactDOM.render(
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <DarkLightModeProvider>
            <AuthIsLoaded>
                <App />
            </AuthIsLoaded>
            </DarkLightModeProvider>
        </ReactReduxFirebaseProvider> 
    </Provider>,
document.getElementById('root'));

serviceWorker.register();
