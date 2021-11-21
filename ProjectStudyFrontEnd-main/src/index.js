import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reducer from './store/reducers/auth';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhances(
  applyMiddleware(thunk)
));


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)