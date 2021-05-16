import axios from 'axios'
import { Redirect } from 'react-router';
import {setAlert} from './alert'
import {GET_PROFILE, PROFILE_ERROR,CLEAR_PROFILE } from './types'


//Get Current User Profile

export const getCurrentProfile = () => async dispatch =>{

    try{

        const res=await axios.get('/api/profile/me');


        dispatch({

            type:GET_PROFILE,
            payload:res.data
        });

    }
    catch(err){

        dispatch({

            type:PROFILE_ERROR,
            payload:{msg: err.response.statusText, status: err.response.status}
        });

    }
}
export const createProfile = (formData,edit=false) => async dispatch =>{

   
    try{


        const config={

            headers:{
                'Content-Type':'application/json'
            }
        }
        
        const res=await axios.post('/api/profile',formData,config);

        if (edit){
            console.log(formData);
        }
        dispatch({

            type:GET_PROFILE,
            payload:res.data
        });

        dispatch(setAlert(edit? 'Profile Updated': 'Profile Created','success'));

    

    }
    catch(err){

        const errors=err.response.data.errors;
        console.error(err.message);
        if(errors){
            errors.forEach(error =>dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({

            type:PROFILE_ERROR,
            payload:{msg: err.response.statusText, status: err.response.status}
        });


    }
}
