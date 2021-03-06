import React, {Fragment,useEffect} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner'
import {getCurrentProfile}  from '../../actions/profile';
import {GET_PROFILE, PROFILE_ERROR,CLEAR_PROFILE } from '../../actions/types';

import DashboardActions from './DashboardActions';
const Dashboard = ({getCurrentProfile,auth:{isAuthenticated,user},profile:{profile,loading}}) => {
    useEffect(()=>{
        getCurrentProfile();
    },[]);

        return loading && profile == null ? <Spinner/> : <Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className='lead'>

                <i className='fas fa-user'/>Welcome {user && user.name}
            </p>

            {profile ? <Fragment><DashboardActions/></Fragment>:<Fragment>
                <p>You have not created a profile, please set/create it. </p>
                <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
                
                </Fragment>}

        </Fragment>




}

Dashboard.propTypes = {

    getCurrentProfile: PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
    profile:PropTypes.object.isRequired


};
const mapStateToProps=state=>({
    auth:state.auth,
    profile:state.profile
});


export default connect (mapStateToProps,{getCurrentProfile})(Dashboard);