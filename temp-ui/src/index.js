import React from 'react';
import ReactDOM from 'react-dom';


import { HashRouter, Route, Switch } from 'react-router-dom';


import { invaderServerAddressIP } from "./config";

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import appReducer from './reducers/appReducer'
import I from 'immutable'

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
import Socket from './apis/Socket'
import Password from "./views/Login/Password"



Window.invaderServerAddress = "http://" + invaderServerAddressIP

const store = createStore(appReducer, applyMiddleware(thunk))
var socket = new Socket(store)
socket.initWebSocket()

ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path="/pcc" name="Home" component={Full} />
        <Route exact path="/" name="login" component={Login} />
        <Route exact path="/setPass" name="Password" component={Password} />
      </Switch>
    </HashRouter>
  </Provider>

), document.getElementById('root'));
