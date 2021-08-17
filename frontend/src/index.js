import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { compose, createStore, applyMiddleware} from 'redux'
import reducer from './store/reducers/auth'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhances(
  applyMiddleware(thunk)
))



const app = (
  // moi file trong src deu su dung dc state tu reducer
  <Provider store={store}>
    <App /> 
  </Provider>
)

ReactDOM.render(
  app,
  document.getElementById('root')
);

// reportWebVitals();
