require('../css/styles.css');
require('../css/react-big-calendar.css');
require('../css/rc-time-picker.css');

import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Switch, Route } from 'react-router-dom'

import App from './components/app.jsx';

ReactDOM.render(
  <BrowserRouter>
      <Route path='/' component={App}/>
  </BrowserRouter>,
  document.getElementById('root')
);
