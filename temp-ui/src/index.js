import React from 'react';
import ReactDOM from 'react-dom';


import { HashRouter, Route, Switch } from 'react-router-dom';

import createBrowserHistory from 'history/createBrowserHistory';
import { invaderServerAddress } from "./config";
import { Redirect } from 'react-router-dom';

// Styles
// Import Flag Icons Set
// import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss';

// Containers
import Full from './containers/Full/';
import Login from './views/Login/Login';
import Dashboard from './views/Dashboard/Dashboard';

export const customHistory = createBrowserHistory()

Window.invaderServerAddress = invaderServerAddress

ReactDOM.render((
  <HashRouter>
    <Switch>
      <Route path="/pcc" name="Home" component={Full} />
      <Route exact path="/" name="login" component={Login} />
    </Switch>
  </HashRouter>

), document.getElementById('root'));
