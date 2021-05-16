import React, {Fragment,useEffect} from 'react'
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import CreateProfile from './components/profile_forms/CreateProfile';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';

import EditProfile from './components/profile_forms/EditProfile';
//Redux

import {Provider} from 'react-redux';
import store from './store';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App=() => {
  
  useEffect(() => {
  
    store.dispatch(loadUser());

  },[]);
    
    return (
  <Provider store={store}>
    <Router>

      <Fragment>
          <Navbar/>
          <Route exact path='/' component={Landing} />

          <section className='container'>
            <Alert/>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/create-profile' component={CreateProfile} />
              <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            </Switch>

          </section>
      </Fragment>

    </Router>
  </Provider>



  );
  };


export default App;
