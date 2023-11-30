import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sessionReducer from './session'; // Adjust the path accordingly

const rootReducer = combineReducers({
  session: sessionReducer
});


let enhancer;

if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const createReduxStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};



export default createReduxStore;
