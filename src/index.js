import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider, useSelector } from 'react-redux';
import { ReactReduxFirebaseProvider, isLoaded } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import createReduxStore from './store/createReduxStore';
import { DarkLightModeProvider } from './utils/DarkLightModeContext';
import { getUserData } from './store/actions/userActions';

import firebase from './utils/Firebase';
import Loading from './utils/Loading';

const store = createReduxStore();

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

const AuthIsLoaded = ({ children }) => {
  const auth = useSelector((state) => state.firebase.auth);
  
  if (!isLoaded(auth)) return <Loading />;
  if (!auth.isEmpty) {
    store.dispatch(getUserData());
  }
  return children;
};

ReactDOM.render(
  <Provider store={store}>
    <DarkLightModeProvider>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthIsLoaded>
          <App />
        </AuthIsLoaded>
      </ReactReduxFirebaseProvider>
    </DarkLightModeProvider>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.register();
