import React, {Fragment, useState } from 'react'
import axios from 'axios'
import {Link,Redirect} from 'react-router-dom'
import {setAlert} from '../../actions/alert'

import {login} from '../../actions/auth'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const Login = ({login,isAuthenticated}) => {

    const [formData,setFormData]= useState({
        email: '',
        password: ''

    });
    const {email,password}=formData;

    const onChange =(e)=>setFormData({...formData,[e.target.name]:e.target.value});



    const onSubmit=async (e)=>{
        e.preventDefault();
        login(email,password);

    }
    if(isAuthenticated){
      return <Redirect to='/dashboard'/>
    }
    return  <Fragment>
      <h1 className="large text-primary">Sign in to your account</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign in</p>
      <form className="form" action="create-profile.html">
        <div className="form-group">
          <input type="email" placeholder="Email Address" name={"email"} value={email} onChange={e=>onChange(e)}/>

        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e=>onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" onClick= {e=>onSubmit(e)}/>
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/Register">Sign up</Link>
      </p>


  </Fragment>
}

Login.propTypes={

  setAlert:PropTypes.func.isRequired,
  Login:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool
};

const mapStateToProps= state => ({
  isAuthenticated:state.auth.isAuthenticated
});

export default connect(mapStateToProps,{setAlert,login}) (Login);