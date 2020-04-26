import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { getFirestore } from 'redux-firestore';
import { getFirebase } from 'react-redux-firebase';
import rootReducer from './reducers/rootReducer';

const initialState = {}

const middlewares = [
  thunk.withExtraArgument({getFirebase, getFirestore})
]

//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export default () => {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares))
  )
}
