import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import compose from 'compose-function';
import {loadLocalState, saveLocalState} from '../utils/localStorage';
import {appVer} from '../constants/configuration';
import * as reducers from '../reducers';
import throttle from 'lodash/throttle';
import {initialState} from '../constants/configuration';
import { reducer as formReducer } from 'redux-form';
import LogRocket from 'logrocket';

reducers.form = formReducer;

const reducer = combineReducers(reducers);

// Initialize LogRocket. Log tool.
// if (ENABLED_LOGGING) {
  // LogRocket.init('jcku34/contrib-pipeline');
// }

// let persistedState = loadLocalState() || {};
let persistedState = {};

// Check application version and reset store if need it.
if (!persistedState.appState || appVer !== persistedState.appState.appVer) {
  persistedState = {
    appState: initialState
  };
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preloadedState = persistedState) {
  const store = createStore(
    reducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(thunkMiddleware, LogRocket.reduxMiddleware()),
    ));

  // store.subscribe(throttle(() => {
  //   saveLocalState(store.getState());
  // }, 1000));

  return store;
}