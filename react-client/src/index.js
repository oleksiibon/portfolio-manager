import React from 'react';
import ReactDOM from 'react-dom';
import {ConnectedRouter} from 'connected-react-router';
import {Provider} from 'react-redux'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {initializeIcons} from '@uifabric/icons';
import axios from 'axios';
import {history, store} from "./store";
import setAuthInterceptor from "./service/axiosInterceptors";

initializeIcons();
setAuthInterceptor();

process.env.NODE_ENV === 'development' ? axios.defaults.baseURL = 'http://localhost:8000' : axios.defaults.baseURL = '/api';

if (localStorage.getItem('token'))
  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;

ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>
), document.getElementById('root'));
registerServiceWorker();
